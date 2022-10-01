import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import prisma from '../lib/prisma';
import pubsub from '../lib/pubsub';
import { Claims, getSession } from '@auth0/nextjs-auth0';
import { NextApiResponse, NextApiRequest } from 'next';

export type BaseContext = {
  prisma: PrismaClient;
  pubsub: PubSub;
};

export type Context = {
  prisma: PrismaClient;
  pubsub: PubSub;
  accessToken?: string;
  user?: Claims;
};

interface RequestHandler {
  req: NextApiRequest;
  res: NextApiResponse;
}

export async function createUserContext({
  req,
  res,
}: RequestHandler): Promise<Context> {
  const session = getSession(req, res);
  return {
    prisma,
    pubsub,
    accessToken: session?.accessToken,
    user: session?.user,
  };
}

export async function createBaseContext(): Promise<BaseContext> {
  return { prisma, pubsub };
}
