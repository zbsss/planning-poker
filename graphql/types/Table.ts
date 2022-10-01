import { extendType, nonNull, objectType, stringArg } from 'nexus';
import { Player } from './Player';

export const Table = objectType({
  name: 'Table',
  definition(t) {
    t.nonNull.string('id');
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

export const TableQuery = extendType({
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
