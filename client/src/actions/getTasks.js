const request = require('request');
const moment = require('moment');

import settings from '../settings'
import cookie from 'react-cookie'

import taskState from '../state/task'

export default function getTasks(user, cb) {
  if (!cookie.load("token")) return cb(false);

  if (!user || !user._id) return cb(false);

  let tasksOpt = {
    url: settings.api_host + "/task?userId=" + user._id,
    method: "GET",
    headers: {
      'Accept': 'application/json',
      'x-access-token': cookie.load('token')
    }
  }

  request(tasksOpt, (error, resp, body) => {
    if (error) return cb(false, error);

    if (resp.statusCode !== 200) return cb(false, body);

    try {
      let tasks = JSON.parse(body);

      // format the dates in a readable format
      for (var i=0; i<tasks.length; i++) {
        if (tasks[i].due) {
          if (user.timezone.indexOf("+") > -1) {
            let modifier = parseInt(user.timezone.substring(user.timezone.indexOf("+")+1, user.timezone.indexOf(":")));
            if (user.timezone.indexOf(":30") > -1) {
              modifier += 0.5;
            } else if (user.timezone.indexOf(":45") > -1) {
              modifier += 0.75;
            }

            tasks[i].due = moment(tasks[i].due).add(modifier, "hours").format("M/D/YYYY h:mm a");
          } else if (user.timezone.indexOf("-") > -1) {
            let modifier = parseInt(user.timezone.substring(user.timezone.indexOf("-")+1, user.timezone.indexOf(":")));
            if (user.timezone.indexOf(":30") > -1) {
              modifier += 0.5;
            } else if (user.timezone.indexOf(":45") > -1) {
              modifier += 0.75;
            }

            tasks[i].due = moment(tasks[i].due).subtract(modifier, "hours").format("M/D/YYYY h:mm a");
          }
          // console.log(moment(tasks[i].due).format("M/D/YYYY h:mm a"));
          // tasks[i].due = moment(tasks[i].due).format("M/D/YYYY h:mm a");
        }
      }

      taskState.addTask(tasks);
      return cb(true, tasks);
    } catch (e) {
      console.log(e);
      console.log(body);
      return cb(false, body);
    }
  });
}
