const request = require('request');

import settings from '../settings'
import cookie from 'react-cookie'

export default function connectGoogleCalendar(user, cb) {
  if (!user) return cb("User and google response missing");

  var options = {
    url: settings.api_host + "/social/connect/google?userId=" + user._id,
    method: "GET",
    headers: {
      'x-access-token': cookie.load('token'),
      'Accept': 'application/json'
    }
  };

  request(options, (error, resp, body) => {
    if (error) return cb(error);
    if (resp.statusCode > 300) {
      return cb(body);
    }

    try {
      window.location.href=JSON.parse(body).url;
      cb(null, body);
    } catch (e) {
      cb(e);
    }
  });
}
