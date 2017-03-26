const request = require('request');
// get the environment specific settings

var settings;
if (process.env.NODE_ENV == "production") {
  settings = require('../settings');
} else {
  settings = require('../settings-dev');
}

module.exports = {
  addUser: addUser
}

function addUser(user) {
  var mailchimpOpt = {
    url: settings.mailchimp.host + "/lists/" + settings.mailchimp.general_list + "/members",
    auth: {
      'user': "depomo",
      'pass': settings.mailchimp.api_key
    },
    method: "POST",
    form: JSON.stringify({
      email_address: user.email,
      status: "subscribed",
      merge_fields: {
        FNAME: user.name
      }
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  request(mailchimpOpt, (error, resp, body) => {
    if (error) {
      console.log(error);
      return;
    }

    console.log(body);
  });
}
