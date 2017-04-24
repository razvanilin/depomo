const request = require('request');

import settings from '../settings'
import cookie from 'react-cookie'
import userState from '../state/user'

export default function addPaymentMethod(type, hostedFields, userId, cb) {
  if (!hostedFields) cb(false, 'hostedFields object is missing');
  if (!userId) cb(false, "No userId");

  if (type === 'card') {
    hostedFields.tokenize(function (err, payload) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(payload);

      var paymentOpt = {
        url: settings.api_host + "/payment/" + userId + "/method",
        method: "POST",
        form: payload,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token": cookie.load("token")
        }
      };

      request(paymentOpt, (error, resp, body) => {
        if (error) return cb(false, error);
        if (resp.statusCode !== 200) return cb(false, body);

        let newUser;
        try {
          newUser = JSON.parse(body);
        } catch (e) {
          newUser = body;
        }

        // set new user in the state
        userState.set(newUser);

        return cb(true, newUser);
      });
    });
  } else if (type === 'paypal') {
    hostedFields.tokenize({
      flow: 'vault',
      billingAgreementDescription: "You agree to let Depomo to extract deposits from your paypal account.",
      locale: "en_US"
    }, (err, payload) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(payload);

      var paymentOpt = {
        url: settings.api_host + "/payment/" + userId + "/method",
        method: "POST",
        form: payload,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token": cookie.load("token")
        }
      };

      request(paymentOpt, (error, resp, body) => {
        if (error) return cb(false, error);
        if (resp.statusCode !== 200) return cb(false, body);

        let newUser;
        try {
          newUser = JSON.parse(body);
        } catch (e) {
          newUser = body;
        }

        // set new user in the state
        userState.set(newUser);

        return cb(true, newUser);
      });
    });
  }
}
