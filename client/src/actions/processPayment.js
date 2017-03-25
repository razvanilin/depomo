const request = require('request');

import { Goto } from 'jumpsuit'
import cookie from 'react-cookie'
import settings from '../settings'

function getQueryStringValue (key) {
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

export default function processPayment() {
  var userId = getQueryStringValue("user_id");
  var paymentId = getQueryStringValue("paymentId");
  var payerId = getQueryStringValue("PayerId");
  var activityId = getQueryStringValue("activity_id");

  if (!userId || !paymentId) {
    Goto({
      path: "/dashboard/activities",
      query: {
        payment_failure: true
      }
    });
    return;
  }

  // build the request to register the payment confirmation
  var paymentOpt = {
    url: settings.api_host + "/payment/confirm",
    method: "POST",
    form: {
      userId: userId,
      paymentId: paymentId,
      payerId: payerId,
      activityId: activityId
    },
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "x-access-token": cookie.load("token")
    }
  };

  request(paymentOpt, (error, resp, body) => {
    if (error || resp.statusCode !== 200) {
      console.log(error);
      Goto({
        path: "/dashboard/activities",
        query: {
          payment_failure: true
        }
      });
      return;
    }

    Goto({
      path: "/dashboard/activities"
    });
  });
}
