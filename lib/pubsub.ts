import { PubSub } from 'graphql-subscriptions';

export interface Event<T> {
  data: T;
}

const pubsub = new PubSub();

export default pubsub;
