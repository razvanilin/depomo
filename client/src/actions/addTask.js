const request = require('request');
const moment = require('moment-timezone');

import { Goto } from 'jumpsuit'
import cookie from 'react-cookie'

import settings from '../settings'
import getTasks from './getTasks'

export default function addTask(task, user, cb) {
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

  // check if date is in the past
  if (moment.tz(user.timezone).diff(moment.tz(task.due, "M/D/YYYY h:mm a", user.timezone), 'minutes') > 0) {
    return cb(false, "Cannot select a date in the past");
  }

  // add the user ID to the request body
  task._id = user._id;

  // format the date into the server format UTC
  task.due = moment.tz(task.due, "M/D/YYYY h:mm a", user.timezone).utc().format();

  var requestBody = JSON.parse(JSON.stringify(task));
  // requestBody.due = taskDue;

  var taskOpt = {
    url: settings.api_host + "/task",
    method: "POST",
    form: requestBody,
    headers: {
      'x-access-token': cookie.load('token'),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };

  request(taskOpt, (error, resp, body) => {
    if (error) return cb(false, error);

    if (resp.statusCode !== 200) return cb(false, body);

    //taskState.addTask(task);
    getTasks(user, (success, message) => {
      cb(true);
      Goto({
        path: "/dashboard/tasks"
      });
    });
  });
}
