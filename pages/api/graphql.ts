import { ApolloServer } from 'apollo-server-micro';
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';
import { createBaseContext, createUserContext } from '../../graphql/context';
import { schema } from '../../graphql/schema';
import Cors from 'micro-cors';
import { Disposable } from 'graphql-ws';
import { MicroRequest } from 'apollo-server-micro/dist/types';
import { ServerResponse } from 'http';

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Based on:
 * https://github.com/vercel/next.js/discussions/27680
 */

const apolloServer = new ApolloServer({
  schema,
  cache: 'bounded',
  context: createUserContext,
  plugins: [
    {
      async serverWillStart(...args) {
        return {
          async drainServer() {
            console.log(`ApolloServer: drain server :>>>>>>>>>>>>>>>>>>`);
            if (graphqlWSS) {
              console.log(`ApolloServer: disposing WSS :>>>>>>>>>>>>>>>>>>`);
              await graphqlWSS.dispose();
            }
          },
        };
      },
    },
  ],
});

const startServer = apolloServer.start();
let graphqlWSS: Disposable;
let apolloServerHandler: ReturnType<typeof apolloServer.createHandler>;

const handler = async (req: MicroRequest, res: ServerResponse) => {
  if (req.method === 'OPTIONS') {
    return res.end();
  }

  const oldApolloServer = res.socket.server.apolloServer;

  if (oldApolloServer && oldApolloServer !== apolloServer) {
    console.warn('Fixing Apollo Server hot reload');
    oldApolloServer.stop();
    delete res.socket.server.apolloServer;
  }

  if (!res.socket.server.apolloServer || !apolloServerHandler) {
    res.socket.server.apolloServer = apolloServer;

    if (!graphqlWSS) {
      /* eslint-disable react-hooks/rules-of-hooks */
      console.log(`Initializing GraphQL WSS :>>>>>>>>>>>>>>>>>>`);
      const wss = new WebSocketServer({
        server: res.socket.server,
        path: '/api/graphql',
      });

      graphqlWSS = useServer(
        {
          schema,
          // this is a context for websockets so we don't have access to session here like in the normal context
          context: createBaseContext,
        },
        wss
      );
    }

    await startServer;

    apolloServerHandler = apolloServer.createHandler({ path: '/api/graphql' });
  }

  await apolloServerHandler(req, res);
};

const cors = Cors({
  // allowCredentials: 'include' as any,
  // allowHeaders: ['Access-Control-Allow-Origin'],
  // origin: 'https://studio.apollographql.com',
  // origin: 'https://studio.apollographql.com,http://localhost:3000',
  // origin: ['https://studio.apollographql.com', 'http://localhost:3000'] as any,
});

export default cors(handler);
