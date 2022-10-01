import { extendType, nonNull, objectType, stringArg } from 'nexus';
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

export const GetTable = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('table', {
      type: Table,
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        const table = await ctx.prisma.table.findUnique({
          where: { id: args.id },
        });

        if (!table) {
          throw new Error('Table missing');
        }

        return {
          ...table,
          revealAt: table.revealAt?.toISOString(),
        };
      },
    });
  },
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
          data: {
            userId: user.id,
            isReady: false,
          },
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

        return { ...table, revealAt: table?.revealAt?.toISOString() };
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
        });

        return tables.map((table) => ({
          ...table,
          revealAt: table?.revealAt?.toISOString(),
        }));
      },
    });
  },
});
