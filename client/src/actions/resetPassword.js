const request = require('request');

import { Goto } from 'jumpsuit'
import settings from '../settings'

function getQueryStringValue (key) {
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

export default function resetPassword(password, cb) {

  var token = getQueryStringValue('token');
  var hash = getQueryStringValue('hash');

  if (!token || !hash) {
    return cb(false, "The password reset cannot be completed at this time.");
  }

  // build the request to reset the password
  var resetOpt = {
    url: settings.api_host + "/user/password",
    method: "PUT",
    form: {
      token: token,
      hash: hash,
      password: password
    },
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  };

  request(resetOpt, (error, resp, body) => {
    if (error) {
      console.log(error);
      return cb(false, error);
    }
    if (resp.statusCode !== 200) {
      return cb(false, body);
    }

    Goto({
      path: "/login"
    });

    return cb(true, body);
  });
}
