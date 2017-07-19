const request = require('request');

import { Goto } from 'jumpsuit'

import settings from '../settings'
import cookie from 'react-cookie'
import userState from '../state/user'

export default function addPaymentMethod(type, stripeToken, userId, cb) {
  if (!stripeToken || !stripeToken.id ) cb('Stripe token object is missing');
  if (!userId) cb("No userId");

  var paymentOpt = {
    url: settings.api_host + "/payment/" + userId + "/method",
    method: "POST",
    form: {
      stripeToken: stripeToken,
    },
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "x-access-token": cookie.load("token")
    }
  };

  request(paymentOpt, (error, resp, body) => {
    if (error) return cb(error);
    if (resp.statusCode !== 200) return cb(body);

    let newUser;
    try {
      newUser = JSON.parse(body);
    } catch (e) {
      newUser = body;
    }

    // set new user in the state
    userState.set(newUser);

    Goto({
      path: "/dashboard/tasks/add"
    });

    return cb(null, newUser);
  });
}
