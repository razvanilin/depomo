import cookie from 'react-cookie'
import { Goto } from 'jumpsuit'

import userState from '../state/user'

export default function logout() {
  cookie.remove('token', {path: '/'});
  userState.login({});
  
  Goto({
    path: "/"
  });
}
