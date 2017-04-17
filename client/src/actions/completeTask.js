const request = require('request');

import settings from '../settings'
import cookie from 'react-cookie'

export default function completeTask(taskId, userId, cb) {
  if (!taskId || !cookie.load('token')) cb(false, "Cannot process the request at this time.");

  var requestOpt = {
    url: settings.api_host + "/task/" + taskId + "/complete",
    method: "PUT",
    form: { userId: userId },
    headers: {
      'Accept': 'application/json',
      'x-access-token': cookie.load('token')
    }
  };

  request(requestOpt, (error, resp, body) => {
    if (error) return cb(false, error);
    if (resp.statusCode !== 200) cb(false, body);
    
    return cb(true, body);
  });
}
