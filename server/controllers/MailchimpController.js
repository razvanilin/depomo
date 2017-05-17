const request = require('request');
const mailchimp = require('../modules/mailchimp');

module.exports = (app, route) => {

  app.post('/mailchimp/pre', (req, res) => {
    if (!req.body.email) return res.status(400).send("The email is missing");

    var mailchimpOpt = {
      url: app.settings.mailchimp.host + "/lists/" + app.settings.mailchimp.pre_list + "/members",
      auth: {
        'user': "depomo",
        'pass': app.settings.mailchimp.api_key
      },
      method: "POST",
      form: JSON.stringify({
        email_address: req.body.email,
        status: "subscribed"
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    };

    request(mailchimpOpt, (error, resp, body) => {
      if (error) {
        console.log(error);
        return res.status(400).send(error);
      }

      return res.status(200).send(body);
    });
  });

  return (req, res, next) => {
    next();
  }
};
