const request = require('request');

import settings from '../settings'

export default function forgotPassword(email, cb) {
  if (!email) return cb(false, "Email is missing");

  var forgotOpt = {
    url: settings.api_host + "/user/forgot",
    method: "POST",
    form: {
      email: email
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  request(forgotOpt, (error, resp, body) => {
    if (error) return cb(false, error);
    if (resp.statusCode !== 200) return cb(false, body);

    return cb(true, body);
  });
}
