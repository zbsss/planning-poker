import { extendType, objectType } from 'nexus';
import { Context } from '../context';
import { UserProfile as User } from '@prisma/client';

export const UserProfile = objectType({
  name: 'UserProfile',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.string('email');
    t.string('image');
  },
});

export const RegisterUser = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('registerUser', {
      type: UserProfile,
      resolve: async (_parent, args, ctx) => {
        requireUserLoggedIn(ctx);

        const userInfo = {
          name: ctx?.user?.nickname,
          email: ctx?.user?.email,
          image: ctx?.user?.picture,
        };

        const user = await ctx.prisma.userProfile.upsert({
          where: {
            email: ctx?.user?.email,
          },
          update: userInfo,
          create: userInfo,
        });

        return user;
      },
    });
  },
});

export const getUser = async (ctx: Context): Promise<User | null> => {
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
  const user = await getUser(ctx);

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
