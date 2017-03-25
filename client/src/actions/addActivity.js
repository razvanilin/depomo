const request = require('request');

import { Goto } from 'jumpsuit'
import cookie from 'react-cookie'

import activityState from '../state/activity'
import settings from '../settings'

export default function login(activity, userId) {
  if (!activity || !activity.due || !activity.label || !activity.deposit || !activity.currency) {
    return activityState.addActivity(false);
  }

  // check if the user is authorised to do this action
  if (!cookie.load('token')) {
    activityState.addActivity(false);
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
    if (error) return activityState.addActivity(false);

    var responseObj;
    try {
      responseObj = JSON.parse(body);
      activityState.addActivity(responseObj.activity);
      // Goto({
      //   path: responseObj.payment.links[1].href
      // });
      window.location.href = responseObj.payment.links[1].href;
    } catch (e) {
      console.log(e);
      console.log(body);
      activityState.addActivity(false);
    }
  });
}
