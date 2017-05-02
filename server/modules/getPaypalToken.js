const request = require('request');
// get the environment specific settings
var settings;
if (process.env.NODE_ENV == "production") {
  settings = require('../settings');
} else if (process.env.NODE_ENV == "staging") {
  settings = require('../settings-staging');
} else {
  settings = require('../settings-dev');
}

module.exports = cb => {
  var tokenOpt = {
    url: settings.paypal.api_host + "/oauth2/token",
    method: "POST",
    auth: {
      user: settings.paypal.client_id,
      pass: settings.paypal.secret
    },
    form: {
      grant_type: "client_credentials"
    },
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  };

  request(tokenOpt, (error, resp, body) => {
    if (error) return cb(false, error);
    try {
      var token = JSON.parse(body);
      if (token.error) return cb(false, token);

      return cb(true, token);
    } catch (e) {
      console.log(e);
      return cb(false, body);
    }
  });
}
