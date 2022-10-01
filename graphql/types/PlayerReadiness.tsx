import { objectType, extendType, nonNull, stringArg } from 'nexus';
import { requireUserLoggedIn } from './UserProfile';
import { Event } from '../../lib/pubsub';
import { Context } from '../context';

export const Readiness = objectType({
  name: 'Readiness',
  definition(t) {
    t.nonNull.string('userId');
    t.nonNull.boolean('isReady');
  },
});

interface Readiness {
  userId: string;
  isReady: boolean;
}

export const playerReadinessTopic = (tableId: string) =>
  `/tables/${tableId}/readiness`;

export const emitPlayerReadinessEvent = async (
  ctx: Context,
  tableId: string,
  event: Event<Readiness>
) => {
  await ctx.pubsub.publish(playerReadinessTopic(tableId), event);
};

export const PlayerReadiness = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('playerReadiness', {
      type: Readiness,
      args: {
        tableId: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        requireUserLoggedIn(ctx);

        const players = await ctx.prisma.player.findMany({
          where: { tableId: args.tableId },
          select: {
            userId: true,
            chosenCard: true,
          },
        });

        return players.map((player) => ({
          userId: player.userId,
          isReady: !!player.chosenCard,
        }));
      },
    });
  },
});

export const PlayerReadinessUpdates = extendType({
  type: 'Subscription',
  definition(t) {
    t.nonNull.list.nonNull.field('playerReadiness', {
      type: Readiness,
      args: {
        tableId: nonNull(stringArg()),
      },
      subscribe(_parent, args, ctx) {
        return ctx.pubsub.asyncIterator(playerReadinessTopic(args.tableId));
      },
      async resolve(eventPromise: Promise<Event<Readiness>>) {
        const { data } = await eventPromise;
        return [data];
      },
    });
  },
});
