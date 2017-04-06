const request = require('request');

import settings from '../settings'

export default function subscribeEmail(email, cb) {

  if (!email) return cb(false);

  var mailchimpOpt = {
    url: settings.api_host + "/mailchimp/pre",
    method: "POST",
    form: {
      email: email
    },
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  };

  request(mailchimpOpt, (error, resp, body) => {
    if (error) return cb(false, error);
    if (resp.statusCode !== 200) return cb(false, body);

    return cb(true);
  });
}
