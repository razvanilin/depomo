const request = require('request');

import settings from '../settings'
import cookie from 'react-cookie'


function getNotificationPreferences(token, cb) {
  if (!token) return cb("No token found");

  var options = {
    url: settings.api_host + "/user/notification/get?token=" + token,
    method: "GET",
    headers: {
      "Accept": "application/json"
    }
  };

  request(options, (error, resp, body) => {
    if (error) return cb(error);
    if (resp.statusCode !== 200) return cb(body);

    try {
      return cb(null, JSON.parse(body));
    } catch (e) {
      return cb(e);
    }
  });
}

function updateNotificationPreferences(token, notificationObj, cb) {
  if (!token) return cb("No token found");
  var notifications;

  try {
    notifications = JSON.parse(JSON.stringify(notificationObj));
  } catch (e) {
    return cb(e);
  }

  if (notifications.offsetType === 'hours') {
    notifications.reminderOffset *= 60;
  } else if (notifications.offsetType === 'days') {
    notifications.reminderOffset *= 24*60;
  }

  notifications.token = token;

  var options = {
    url: settings.api_host + "/user/notification/update",
    method: "PUT",
    form: notifications,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  };

  request(options, (error, resp, body) => {
    if (error) return cb(error);
    if (resp.statusCode !== 200) return cb(body);

    return cb(null, body);

  });
}

export default {
  getNotificationPreferences: getNotificationPreferences,
  updateNotificationPreferences: updateNotificationPreferences
}
