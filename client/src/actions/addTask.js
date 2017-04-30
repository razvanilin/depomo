const request = require('request');
const moment = require('moment');

import { Goto } from 'jumpsuit'
import cookie from 'react-cookie'

import taskState from '../state/task'
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

  // add the user ID to the request body
  task._id = user._id;

  // format the date into the server format UTC
  //task.due = moment(task.due, "M/D/YYYY h:mm a").format();
  var taskDue;
  // take the timezone into account
  try {
    if (user.timezone.indexOf("+") > -1) {
      let modifier = parseInt(user.timezone.substring(user.timezone.indexOf("+")+1, user.timezone.indexOf(":")), 10);
      if (user.timezone.indexOf(":30") > -1) {
        modifier += 0.5;
      } else if (user.timezone.indexOf(":45") > -1) {
        modifier += 0.75;
      }

      taskDue = moment(task.due, "M/D/YYYY h:mm a").subtract(modifier, "hours").format();
    } else if (user.timezone.indexOf("-") > -1) {
      let modifier = parseInt(user.timezone.substring(user.timezone.indexOf("-")+1, user.timezone.indexOf(":")), 10);
      if (user.timezone.indexOf(":30") > -1) {
        modifier += 0.5;
      } else if (user.timezone.indexOf(":45") > -1) {
        modifier += 0.75;
      }

      taskDue = moment(task.due, "M/D/YYYY h:mm a").add(modifier, "hours").format();
    }
  } catch(e) {
    console.log(e);
    return cb(false, "There was an error while processing the date due");
  }

  var requestBody = JSON.parse(JSON.stringify(task));
  requestBody.due = taskDue;

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
