const request = require('request');

import cookie from 'react-cookie'
import settings from '../settings'

export default function selectCalendar(user, calendarId, cb) {
  if(!user) cb("User object is missing");
  
  var options = {
    url: settings.api_host + "/social/google/calendar?userId=" + user._id + "&calendarId=" + calendarId,
    method: "GET",
    headers: {
      'x-access-token': cookie.load('token'),
      'Accept': 'application/json'
    }
  };

  request(options, (error, resp, body) => {
    if (error) return cb(error);
    if (resp.statusCode !== 200) return cb(body);

    cb(null, "Success");
  });
}
