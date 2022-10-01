import { objectType } from 'nexus';

export const UserProfile = objectType({
  name: 'UserProfile',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.string('email');
    t.string('image');
  },
});
