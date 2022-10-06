import { objectType, extendType, nonNull, stringArg } from 'nexus';
import { getUserOrThrow, UserProfile } from './UserProfile';
import { Event } from '../../lib/pubsub';
import { Context } from '../context';
import { UserProfile as User } from '@prisma/client';

export const Readiness = objectType({
  name: 'Readiness',
  definition(t) {
    t.nonNull.boolean('isReady');
    t.string('chosenCard');
    t.nonNull.field('user', {
      type: UserProfile,
    });
  },
});

interface Readiness {
  isReady: boolean;
  chosenCard?: string;
  user: User;
}

export const playerReadinessTopic = (tableId: string) =>
  `/tables/${tableId}/readiness`;

export const emitPlayerReadinessEvent = async (
  ctx: Context,
  tableId: string,
  event: Event<Readiness[]>
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
        const user = await getUserOrThrow(ctx);

        const table = await ctx.prisma.table.findUniqueOrThrow({
          where: { id: args.tableId },
          include: {
            players: {
              include: {
                userProfile: {},
              },
            },
          },
        });

        const now = new Date();

        const result = table.players.map((player) => ({
          isReady: !!player.chosenCard,
          chosenCard:
            player.userId === user.id
              ? player.chosenCard
              : table.revealAt && table.revealAt < now
              ? player.chosenCard
              : undefined,
          user: player.userProfile,
        }));

        return result;
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
      async resolve(eventPromise: Promise<Event<Readiness[]>>) {
        const { data } = await eventPromise;
        return data;
      },
    });
  },
});
