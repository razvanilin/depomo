const request = require('request');
const moment = require('moment-timezone');

import { Goto } from 'jumpsuit'
import settings from '../settings'

export default function signup(user, cb) {

  if (!user.email || !user.password || !user.name || !user.agree) {
    return cb(false, "The form is not complete");
  }

  // get the default timezone
  user.timezone = moment.tz.guess();

  let signupOpt = {
    url: settings.api_host + "/user",
    method: "POST",
    form: user,
    headers: {
      "Content-Type": "application/json"
    }
  };

  request(signupOpt, (error, resp, body) => {
    if (error) return cb(false, error);

    if (resp.statusCode === 200) {
      cb(true);
      Goto({
        path: "/login"
      });
      return;
    }

    return cb(false, body);
  });
}
