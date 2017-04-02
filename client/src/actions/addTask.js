const request = require('request');

import { Goto } from 'jumpsuit'
import cookie from 'react-cookie'

import taskState from '../state/task'
import settings from '../settings'

export default function login(task, userId, cb) {
  if (!task || !task.due || !task.label || !task.deposit || !task.currency) {
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
  task._id = userId;

  var taskOpt = {
    url: settings.api_host + "/task",
    method: "POST",
    form: task,
    headers: {
      'x-access-token': cookie.load('token'),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };

  request(taskOpt, (error, resp, body) => {
    if (error) return cb(false, error);

    if (resp.statusCode !== 200) return cb(false, body);

    var responseObj;
    try {
      responseObj = JSON.parse(body);
      taskState.addTask(responseObj.task);
      cb(true);
      window.location.href = responseObj.payment.links[1].href;
    } catch (e) {
      console.log(e);
      console.log(body);
      cb(false, body);
    }
  });
}
