const request = require('request');

import settings from '../settings'
import cookie from 'react-cookie'

export default function getClientAuthorization(userId, cb) {
  if (!userId) return cb(false, "userId is required");

  var clientOpt = {
    url: settings.api_host + "/payment/client_token?userId=" + userId,
    method: "GET",
    headers: {
      "Accept": "application/json",
      "x-access-token": cookie.load("token")
    }
  };

  request(clientOpt, (error, resp, body) => {
    if (error) return cb(false, error);
    if (resp.statusCode !== 200) return cb(false, body);

    try {
      return cb(true, JSON.parse(body));
    } catch (e) {
      console.log(e);
      return cb(false, body);
    }
  });
}
