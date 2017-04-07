const request = require('request');

import settings from '../settings'
import cookie from 'react-cookie'

export default function removeTask(taskId, userId, cb) {
  if (!taskId || !cookie.load('token')) cb(false, "Cannot process the request at this time.");

  var requestOpt = {
    url: settings.api_host + "/task/" + taskId + "/remove",
    method: "PUT",
    form: { userId: userId},
    headers: {
      'Accept': 'application/json',
      'x-access-token': cookie.load('token')
    }
  };

  request(requestOpt, (error, resp, body) => {
    if (error) return cb(false, error);

    return cb(true, body);
  });
}
