const request = require('request');

import { Goto } from 'jumpsuit'
import cookie from 'react-cookie'

import activityState from '../state/activity'
import settings from '../settings'

export default function login(activity, userId, cb) {
  if (!activity || !activity.due || !activity.label || !activity.deposit || !activity.currency) {
    return cb(false, "The form is incomplete");
  }

  // check if the user is authorised to do this action
  if (!cookie.load('token')) {
    cb(false);
    return Goto({
      path: "/login"
    });
  }

  // add the user ID to the request body
  activity._id = userId;

  var activityOpt = {
    url: settings.api_host + "/activity",
    method: "POST",
    form: activity,
    headers: {
      'x-access-token': cookie.load('token'),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };

  request(activityOpt, (error, resp, body) => {
    if (error) return cb(false, error);

    if (resp.statusCode !== 200) return cb(false, body);

    var responseObj;
    try {
      responseObj = JSON.parse(body);
      activityState.addActivity(responseObj.activity);
      cb(true);
      window.location.href = responseObj.payment.links[1].href;
    } catch (e) {
      console.log(e);
      console.log(body);
      cb(false, body);
    }
  });
}
