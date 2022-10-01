import { enumType, extendType, nonNull, objectType, stringArg } from 'nexus';
import {
  getUserOrThrow,
  requireUserLoggedIn,
  UserProfile,
} from './UserProfile';
import { Event } from '../../lib/pubsub';
import { Context } from '../context';

export const Player = objectType({
  name: 'Player',
  definition(t) {
    t.nonNull.string('tableId');
    t.nonNull.string('userId');
    t.string('chosenCard');
    t.nonNull.field('role', { type: PlayerRole });
    t.nonNull.field('userProfile', {
      type: UserProfile,
      async resolve(_parent, _args, ctx) {
        const usr = await ctx.prisma.player
          .findUnique({
            where: {
              tableId_userId: {
                tableId: _parent.tableId,
                userId: _parent.userId,
              },
            },
          })
          .userProfile();

        if (!usr) {
          throw new Error('Failed to load user profile');
        }

        return usr;
      },
    });
  },
});

const PlayerRole = enumType({
  name: 'PlayerRole',
  members: ['PLAYER', 'ADMIN'],
});

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

        const oldCard = await ctx.prisma.player.findUnique({
          where: {
            tableId_userId: {
              tableId: args.tableId,
              userId: user.id,
            },
          },
          select: {
            chosenCard: true,
          },
        });

        if (!oldCard) {
          throw new Error('Unauthorized');
        }

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

        if (
          (!oldCard.chosenCard && args.card) ||
          (oldCard.chosenCard && !args.card)
        ) {
          emitPlayerReadinessEvent(ctx, args.tableId, {
            data: {
              userId: user.id,
              isReady: !!args.card,
            },
          });
        }

        return { chosenCard: updated.chosenCard };
      },
    });
  },
});

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

const playerReadinessTopic = (tableId: string) => `[READINESs] ${tableId}]`;

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

/**
 * PlayersReady
 * {playerId: string, ready: boolean}[]
 *
 * Create subscripton & query to get ready players
 */
