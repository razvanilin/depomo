const request = require('request');

import { Goto } from 'jumpsuit'
import userState from '../state/user'
import settings from '../settings'

export default function login(credentials) {
  if (!credentials.username || !credentials.password) {
    return userState.login(false);
  }

  // copy the username field into the email one to meet the api needs
  credentials.email = credentials.username;

  var loginOpt = {
    url: settings.api_host + "/user/login",
    method: "POST",
    form: credentials,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  };

  request(loginOpt, (error, resp, body) => {
    if (error) return userState.login({error: error});

    try {
      userState.login(JSON.parse(body));
      Goto({
        path: '/'
      });
      return;
    } catch (e) {
      console.log(e);
      console.log(body);
      return userState.login({error: body});
    }

  });
}
