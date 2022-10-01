import { ApolloServer } from 'apollo-server-micro';
import { Server } from 'http';

declare module 'http' {
  export interface ServerResponse {
    socket: {
      server: Server & {
        apolloServer?: ApolloServer;
      };
    };
  }
}
