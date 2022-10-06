import { Table as TableSchema } from '@prisma/client';
import { extendType, nonNull, objectType, stringArg } from 'nexus';
import { Context } from '../context';
import { Player } from './Player';
import { emitPlayerReadinessEvent } from './PlayerReadiness';
import { getUserOrThrow } from './UserProfile';
import jsonwebtoken from 'jsonwebtoken';

export const Table = objectType({
  name: 'Table',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.string('revealAt');
    t.nonNull.list.nonNull.field('players', {
      type: Player,
      async resolve(_parent, _args, ctx) {
        return ctx.prisma.table
          .findUnique({
            where: {
              id: _parent.id,
            },
          })
          .players();
      },
    });
  },
});

const translateTable = (table: TableSchema) => ({
  ...table,
  revealAt: table.revealAt?.toISOString(),
});

export const requireUserAtTable = async (ctx: Context, tableId: string) => {
  const user = await getUserOrThrow(ctx);

  const [table] = await ctx.prisma.table.findMany({
    where: {
      id: tableId,
      players: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      players: { where: { userId: user.id } },
    },
  });

  if (!table) {
    throw new Error('Table does not exist or you are not allowed to see it');
  }

  return { user, table, role: table.players[0].role };
};

export const GetTable = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('table', {
      type: Table,
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        const { table } = await requireUserAtTable(ctx, args.id);
        return translateTable(table);
      },
    });
  },
});

const Url = objectType({
  name: 'Url',
  definition(t) {
    t.nonNull.string('url');
  },
});

export const ShareTable = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('share', {
      type: Url,
      args: {
        tableId: nonNull(stringArg()),
      },
      resolve: async (parent, args, ctx) => {
        const { role } = await requireUserAtTable(ctx, args.tableId);

        if (role !== 'ADMIN') {
          throw new Error(`You don't have permission to share this table`);
        }

        const token = jsonwebtoken.sign(
          {
            tableId: args.tableId,
          },
          process.env.SECRET || 'secret',
          {
            expiresIn: '24 h',
          }
        );

        return { url: `http://localhost:3000/share?token=${token}` };
      },
    });
  },
});

export const JoinTable = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('joinTable', {
      type: Url,
      args: {
        token: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        const user = await getUserOrThrow(ctx);

        const token = jsonwebtoken.verify(
          args.token,
          process.env.SECRET || 'secret'
        );

        const tableId = (token as any).tableId as string;

        if (!tableId) {
          throw new Error('Invalid token');
        }

        try {
          await ctx.prisma.player.create({
            data: {
              userId: user.id,
              tableId: tableId,
            },
          });

          await emitPlayerReadinessEvent(ctx, tableId, {
            data: [
              {
                isReady: false,
                user,
              },
            ],
          });
        } catch (err) {
          console.log('Already joined this table');
        }

        return { url: `http://localhost:3000/tables/${tableId}` };
      },
    });
  },
});

export const CreateTable = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createTable', {
      type: Table,
      args: {
        name: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        const user = await getUserOrThrow(ctx);

        const table = await ctx.prisma.table.create({
          data: {
            name: args.name,
            players: {
              create: {
                role: 'ADMIN',
                userId: user.id,
              },
            },
          },
        });

        return translateTable(table);
      },
    });
  },
});

export const MyTables = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('tables', {
      type: Table,
      resolve: async (_parent, args, ctx) => {
        const user = await getUserOrThrow(ctx);

        const tables = await ctx.prisma.table.findMany({
          where: {
            players: {
              some: {
                userId: user.id,
              },
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
        });

        return tables.map((table) => translateTable(table));
      },
    });
  },
});

export const RevealCards = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('revealCards', {
      type: Table,
      args: {
        tableId: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        const { table } = await requireUserAtTable(ctx, args.tableId);

        if (table.revealAt) {
          throw new Error(
            `Cards are already set to be revealed at ${table.revealAt.toISOString()}`
          );
        }

        const revealAt = new Date();
        revealAt.setSeconds(revealAt.getSeconds() + 5);

        const updatedTable = await ctx.prisma.table.update({
          where: {
            id: args.tableId,
          },
          data: {
            revealAt,
          },
        });

        setTimeout(async () => {
          const players = await ctx.prisma.player.findMany({
            where: {
              tableId: args.tableId,
            },
            include: {
              userProfile: true,
            },
          });

          emitPlayerReadinessEvent(ctx, args.tableId, {
            data: players.map((p) => ({
              isReady: !!p.chosenCard,
              chosenCard: p.chosenCard || undefined,
              user: p.userProfile,
            })),
          });
        }, 5000);

        return translateTable(updatedTable);
      },
    });
  },
});

export const HideCards = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('hideCards', {
      type: Table,
      args: {
        tableId: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        await requireUserAtTable(ctx, args.tableId);

        const table = await ctx.prisma.table.update({
          where: {
            id: args.tableId,
          },
          data: {
            revealAt: null,
          },
        });
        await ctx.prisma.player.updateMany({
          where: {
            tableId: args.tableId,
          },
          data: {
            chosenCard: null,
          },
        });

        const players = await ctx.prisma.player.findMany({
          where: {
            tableId: args.tableId,
          },
          include: {
            userProfile: true,
          },
        });

        emitPlayerReadinessEvent(ctx, args.tableId, {
          data: players.map((p) => ({
            isReady: false,
            user: p.userProfile,
          })),
        });

        return translateTable(table);
      },
    });
  },
});
