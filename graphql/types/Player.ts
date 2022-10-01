import { enumType, objectType } from 'nexus';
import { UserProfile } from './UserProfile';

export const Player = objectType({
  name: 'Player',
  definition(t) {
    t.nonNull.string('id');
    t.string('chosenCard');
    t.nonNull.field('role', { type: PlayerRole });
    t.nonNull.field('userProfile', {
      type: UserProfile,
      async resolve(_parent, _args, ctx) {
        const usr = await ctx.prisma.player
          .findUnique({
            where: {
              id: _parent.id,
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
