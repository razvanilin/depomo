const request = require('request');

import cookie from 'react-cookie'
import settings from '../settings'
import userState from '../state/user'

export default function changeProfile(passwords, userId, cb) {

  if (!cookie.load('token')) return cb(false, "Invalid token");
  if (!passwords || !passwords.password || !passwords.newPassword) return cb(false, "Invalid request");

  var profileOpt = {
    url: settings.api_host + "/user/" + userId + "/password",
    method: "PUT",
    form: passwords,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-access-token': cookie.load('token')
    }
  };

  request(profileOpt, (error, resp, body) => {
    if (error) return cb(false, error);
    if (resp.statusCode !== 200) return cb(false, body);

    let newUser;
    try {
      newUser = JSON.parse(body);
    } catch (e) {
      newUser = body;
    }

    // set new user in the state
    userState.set(newUser);

    return cb(true, body);
  });
}
