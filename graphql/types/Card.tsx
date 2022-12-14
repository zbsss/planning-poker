import { objectType, extendType, nonNull, stringArg } from 'nexus';
import { emitPlayerReadinessEvent } from './PlayerReadiness';
import { getUserOrThrow } from './UserProfile';

export const Card = objectType({
  name: 'Card',
  definition(t) {
    t.string('chosenCard');
  },
});

export const PickCard = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('chooseCard', {
      type: Card,
      args: {
        tableId: nonNull(stringArg()),
        card: stringArg(),
      },
      resolve: async (_parent, args, ctx) => {
        const user = await getUserOrThrow(ctx);

        const updated = await ctx.prisma.player.update({
          where: {
            tableId_userId: {
              tableId: args.tableId,
              userId: user.id,
            },
          },
          data: {
            chosenCard: args.card,
          },
        });

        emitPlayerReadinessEvent(ctx, args.tableId, {
          data: [
            {
              isReady: !!args.card,
              user,
            },
          ],
        });

        return { chosenCard: updated.chosenCard };
      },
    });
  },
});
