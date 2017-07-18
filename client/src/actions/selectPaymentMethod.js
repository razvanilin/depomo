const request = require('request');

import settings from '../settings'
import cookie from 'react-cookie'
import userState from '../state/user'

export default function selectPaymentMethod(token, userId, cb) {
  if (!token || !userId) return cb (false, "Did not receive the necessary information.");

  var requestOpt = {
    url: settings.api_host + "/payment/" + userId + "/method/" + token,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "x-access-token": cookie.load('token')
    }
  };

  request (requestOpt, (error, resp, body) => {
    if (error) return cb(false, error);

    if (resp.statusCode !== 200) return cb(false, body);

    let newUser;
    try {
      newUser = JSON.parse(body);
    } catch (e) {
      newUser = body;
    }

    // set new user in the state
    userState.set(newUser);

    return cb(true, newUser);
  });
}
