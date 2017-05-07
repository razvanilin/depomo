const request = require('request');

import cookie from 'react-cookie'
import settings from '../settings'
import userState from '../state/user'

export default function removeGoogleConnection(user, cb) {

  var options = {
    url: settings.api_host + "/social/google/remove",
    method: "PUT",
    form: {
      userId: user._id
    },
    headers: {
      'x-access-token': cookie.load('token'),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };

  request(options, (error, resp, body) => {
    if (error) return cb(error);

    try {
      userState.login(JSON.parse(body));
      cb(null, {success: true});
    } catch (e) {
      cb(e);
    }
  });
}
