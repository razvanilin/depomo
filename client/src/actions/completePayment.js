const request = require('request');

import settings from '../settings'
import cookie from 'react-cookie'

export default function completePayment(taskId, userId, cb) {
  if (!taskId || !cookie.load('token')) cb(false, "Cannot process the request at this time.");

  var requestOpt = {
    url: settings.api_host + "/task/" + taskId + "/payment",
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

    try {
      var responseObj = JSON.parse(body);
      cb(true, body);
      window.location.href = responseObj.payment.links[1].href;
    } catch (e) {
      console.log(e);
      console.log(body);
      cb(false, "Error parsing the response.")
    }
  });
}
