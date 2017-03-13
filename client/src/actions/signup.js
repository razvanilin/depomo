const request = require('request');

import { Goto } from 'jumpsuit'
import settings from '../settings'
import userState from '../state/user'

export default function signup(user) {
  console.log("sign in function");
  if (!user.email || !user.password || !user.name) {
    return userState.signup(false);
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
    if (error) return userState.signup(false);

    try {
      userState.signup(JSON.parse(body).ops[0]);
      Goto({
        path: "/login"
      });
      return;
    } catch (e) {
      return userState.signup(false);
    }
  });
}
