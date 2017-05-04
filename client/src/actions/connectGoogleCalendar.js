const request = require('request');

import settings from '../settings'
import cookie from 'react-cookie'

export default function connectGoogleCalendar(user, google, cb) {
  if (!user || !google) return cb("User and google response missing");

  var options = {
    url: settings.api_host + "/social/connect/google",
    method: "POST",
    form: google,
    headers: {
      'x-access-token': cookie.load('token'),
      'Content-Type': 'application/josn',
      'Accept': 'application/json'
    }
  };

  console.log("making request");
  request(options, (error, resp, body) => {
    if (error) return cb(error);
    console.log("done");
    if (resp.statusCode > 300) {
      return cb(body);
    }

    cb(null, body);
  });
}
