import { State } from 'jumpsuit'

export default State({
  initial: {
    user: {}
  },
  signup (state, user) {
    console.log("signing in");
    return {user: user};
  },
  login (state, user) {
    return {user: loginUser(user)};
  }
});


function loginUser(user) {

}
