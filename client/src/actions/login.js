const request = require('request');

import { Goto } from 'jumpsuit'
import cookie from 'react-cookie'

import userState from '../state/user'
import settings from '../settings'

export default function login(credentials, token, cb) {
  if (!credentials || !credentials.email || !credentials.password) {
    // if the object is empty, check if there is a valid token in the cookies and try to get the user details from there
    if (!token) return cb(false);

    var relogOpt = {
      url: settings.api_host + "/user/relog",
      method: "POST",
      form: {
        token: token
      },
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    };

    request(relogOpt, (error, resp, body) => {
      if (error) return cb(false);

      try {
        userState.login(JSON.parse(body));
        return cb(true);
      } catch (e) {
        console.log(e);
        return cb(false);
      }
    });

  } else {

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
      if (error) return cb(false, error);

      if (resp.statusCode !== 200) {
        return cb(false, body);
      }

      try {
        var userObject = JSON.parse(body);
        userState.login(userObject);
        cookie.save('token', userObject.token);
        cb(true);
        Goto({
          path: '/dashboard'
        });
        return;
      } catch (e) {
        console.log(e);
        return cb(false, body);
      }
    });
  }
}
