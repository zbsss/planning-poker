import { PubSub } from 'graphql-subscriptions';
import { EventEmitter } from 'events';

export interface Event<T> {
  data: T;
}

/**
 * TODO:
 * The simple EventEmitter pubsub library included in graphql-subscriptions is only intended for demo purposes.
 * EventEmitters don't really scale to large numbers, they're in-memory, and they'll only work
 * as long as you have no more than a single server.
 * For anyone trying to run GraphQL subscriptions in production, I strongly recommend using a different system,
 * for example Redis or MQTT through graphql-redis-subscriptions or graphql-mqtt-subscriptions.
 * This will have the advantage of keeping the GraphQL server stateless (apart from the websockets)
 * and thus easy to scale horizontally.
 */
const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(100);
const pubsub = new PubSub({ eventEmitter });

export default pubsub;
