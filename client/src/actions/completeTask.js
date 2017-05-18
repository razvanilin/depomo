const request = require('request');

import settings from '../settings'
import cookie from 'react-cookie'

export function completeTask(taskId, donation, userId, cb) {
  if (!taskId || !cookie.load('token')) cb(false, "Cannot process the request at this time.");

  var requestOpt = {
    url: settings.api_host + "/task/" + taskId + "/complete",
    method: "PUT",
    form: { userId: userId, donation: donation },
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': cookie.load('token')
    }
  };

  request(requestOpt, (error, resp, body) => {
    if (error) return cb(false, error);
    if (resp.statusCode !== 200) cb(false, body);

    return cb(true, body);
  });
}

export function completeTaskWithToken(taskId, token, cb) {

  var options = {
    url: settings.api_host + "/task/" + taskId + "/complete/token",
    method: "PUT",
    form: {token: token},
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  };

  request(options, (error, resp, body) => {
    if (error) return cb(error);

    try {
      cb(null, JSON.parse(body));
    } catch (e) {
      cb(e);
    }
  });

}
