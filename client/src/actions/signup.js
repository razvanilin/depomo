const request = require('request');

import { Goto } from 'jumpsuit'
import settings from '../settings'
import userState from '../state/user'

export default function signup(user) {
  console.log("sign in function");
  if (!user.email || !user.password || !user.name || !user.agree) {
    return userState.signup({error: "The form is not complete"});
  }

  let signupOpt = {
    url: settings.api_host + "/user",
    method: "POST",
    form: user,
    headers: {
      "Content-Type": "application/json"
    }
  };

  request(signupOpt, (error, resp, body) => {
    if (error) return userState.signup({error: error});

    if (resp.statusCode == 200) {
      Goto({
        path: "/login"
      });
      return;
    }

    return userState.signup({error: body});

  });
}
