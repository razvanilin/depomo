import { State } from 'jumpsuit'

export default State({
  initial: {
    user: {}
  },
  signup (state, user) {
    return user;
  },
  login (state, user) {
    return user;
  },
  set (state, user) {
    return user;
  }
});
