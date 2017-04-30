const request = require('request');
const moment = require('moment-timezone');

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
          tasks[i].due = moment.tz(tasks[i].due, user.timezone).format("M/D/YYYY h:mm a");
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
