const request = require('request');

import settings from '../settings'
import cookie from 'react-cookie'

import taskState from '../state/task'

export default function getTasks(userId, cb) {
  if (!cookie.load("token")) return cb(false);

  if (!userId) return cb(false);

  let tasksOpt = {
    url: settings.api_host + "/task?userId=" + userId,
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
      taskState.addTask(tasks);
      return cb(true, tasks);
    } catch (e) {
      console.log(e);
      console.log(body);
      return cb(false, body);
    }
  });
}
