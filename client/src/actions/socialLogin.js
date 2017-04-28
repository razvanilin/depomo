const request = require('request');
const moment = require('moment');

import { Goto } from 'jumpsuit'
import settings from '../settings'
import userState from '../state/user'
import cookie from 'react-cookie'

export default function socialLogin(profile, cb) {

  profile.timezone = moment().format("Z");

  var options = {
    url: settings.api_host + "/social/facebook/login",
    method: "POST",
    form: profile,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  };

  request(options, (error, resp, body) => {
    if (error) return cb(error);

    try {
      var userObject = JSON.parse(body);
      userState.login(userObject);
      cookie.save('token', userObject.token);
      cb(null, userObject);
      Goto({
        path: '/dashboard'
      });
      return;
    } catch (e) {
      console.log(e);
      return cb(body);
    }
  });
}
