const request = require('request');

import settings from '../settings'



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
    if (resp !== 200) return cb(body);

    try {
      return cb(null, JSON.parse(body));
    } catch (e) {
      return cb(e);
    }
  });
}

function updateNotificationPreferences(token, notifications, cb) {
  if (!token) return cb("No token found");

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
    if (resp !== 200) return cb(body);

    try {
      return cb(null, JSON.parse(body));
    } catch (e) {
      return cb(e);
    }
  });
}

export default Notification = {
  getNotificationPreferences: getNotificationPreferences,
  updateNotificationPreferences: updateNotificationPreferences
}
