const request = require('request');
// get the environment specific settings

var settings;
if (process.env.NODE_ENV == "production") {
  settings = require('../settings');
} else {
  settings = require('../settings-dev');
}

module.exports = {
  addUser: addUser,
  sendEmail: sendEmail
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

function sendEmail(app, template, user, vars, tags) {
  // send user a welcome message
  var templateName = template;
  var templateContent = [{
    name: "Depomo",
    content: "Get ready to break procrastination"
  }];
  var message = {
    from_email: "razvan@depomo.com",
    from_name: "Razvan",
    to: [{
      email: user.email,
      name: user.name,
      type: "to"
    }],
    headers: {
      "Reply-To": "razvan@depomo.com"
    },
    track_opens: true,
    track_clicks: true,
    merge_vars: [{
      rcpt: user.email,
      vars: vars
    }],
    tags: tags || []
  }

  app.mandrill.messages.sendTemplate({
    template_name: templateName,
    template_content: templateContent,
    message: message,
    async: true,
    ip_pool: "Main Pool"
  }, result => {
    console.log("email sent");
    console.log(result);
  }, err => {
    console.log("email error");
    console.log(err);
  });
}
