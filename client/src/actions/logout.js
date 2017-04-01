import cookie from 'react-cookie'
import { Goto } from 'jumpsuit'

export default function logout() {
  cookie.remove('token', {path: '/'});
  Goto({
    path: "/"
  });
}
