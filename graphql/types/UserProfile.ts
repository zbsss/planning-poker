import { extendType, objectType } from 'nexus';
import { Context } from '../context';
import { UserProfile as User } from '@prisma/client';

export const UserProfile = objectType({
  name: 'UserProfile',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.string('email');
    t.string('image');
  },
});

export const RegisterUser = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('registerUser', {
      type: UserProfile,
      resolve: async (_parent, args, ctx) => {
        return ctx.prisma.userProfile.create({
          data: {
            name: ctx?.user?.nickname,
            email: ctx?.user?.email,
            image: ctx?.user?.picture,
          },
        });
      },
    });
  },
});

export const getCurrentUser = async (ctx: Context): Promise<User | null> => {
  const email = ctx?.user?.email;

  if (!email) {
    return null;
  }

  return ctx.prisma.userProfile.findUnique({
    where: {
      email,
    },
  });
};

export const getUserOrThrow = async (ctx: Context): Promise<User> => {
  const user = await getCurrentUser(ctx);

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
};

export const requireUserLoggedIn = (ctx: Context) => {
  if (!ctx.user) {
    throw new Error('Unauthorized');
  }
};
