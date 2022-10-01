import { makeSchema, connectionPlugin } from 'nexus';
import path from 'path';
import * as types from './types';

export const schema = makeSchema({
  types,
  plugins: [connectionPlugin()],
  outputs: {
    typegen: path.join(process.cwd(), 'generated/nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'generated/schema.graphql'),
  },
  contextType: {
    export: 'Context',
    module: path.join(process.cwd(), 'graphql', 'context.ts'),
  },
});
