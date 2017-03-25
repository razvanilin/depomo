const request = require('request');

import { Goto } from 'jumpsuit'
import cookie from 'react-cookie'

import userState from '../state/user'
import settings from '../settings'

export default function login(credentials, token) {
  if (!credentials || !credentials.username || !credentials.password) {
    // if the object is empty, check if there is a valid token in the cookies and try to get the user details from there
    if (!token) return userState.login(false);

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
      if (error) return userState.login(false);

      try {
        userState.login(JSON.parse(body));
        return;
      } catch (e) {
        console.log(e);
        console.log(body);
        return userState.login(false);
      }
    });

  } else {

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
        var userObject = JSON.parse(body);
        userState.login(userObject);
        cookie.save('token', userObject.token);
        Goto({
          path: '/dashboard'
        });
        return;
      } catch (e) {
        console.log(e);
        console.log(body);
        return userState.login({error: body});
      }
    });
  }
}
