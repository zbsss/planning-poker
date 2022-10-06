import { Table as TableSchema, UserProfile } from '@prisma/client';
import { extendType, nonNull, objectType, stringArg } from 'nexus';
import { Context } from '../context';
import { Player } from './Player';
import { emitPlayerReadinessEvent } from './PlayerReadiness';
import { getUserOrThrow } from './UserProfile';

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

export const requireUserAtTable = async (
  ctx: Context,
  tableId: string
): Promise<[UserProfile, TableSchema]> => {
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
  });

  if (!table) {
    throw new Error('Table does not exist or you are not allowed to see it');
  }

  return [user, table];
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
        // TODO: uncomment line once we have invite URLs
        // const table = await requireUserAtTable(ctx, args.id);

        const table = await ctx.prisma.table.findUnique({
          where: { id: args.id },
        });

        if (!table) {
          throw new Error('Table missing');
        }

        return translateTable(table);
      },
    });
  },
});

export const ShareTable = extendType({
  type: 'Query',
  definition(t) {},
});

/**
 * TODO: create shareable URLs that contain a token and expire after set time
 */
export const JoinTable = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('joinTable', {
      type: Player,
      args: {
        tableId: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        const user = await getUserOrThrow(ctx);

        const player = ctx.prisma.player.create({
          data: {
            userId: user.id,
            tableId: args.tableId,
          },
        });

        emitPlayerReadinessEvent(ctx, args.tableId, {
          data: [
            {
              isReady: false,
              user,
            },
          ],
        });

        return player;
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
        const [, table] = await requireUserAtTable(ctx, args.tableId);

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
