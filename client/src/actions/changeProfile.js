const request = require('request');

import cookie from 'react-cookie'
import settings from '../settings'

export default function changeProfile(profile, userId, cb) {

  if (!cookie.load('token')) return cb(false, "Invalid token");
  if (!profile) return cb(false, "No profile information found");

  var profileOpt = {
    url: settings.api_host + "/user/" + userId + "/profile",
    method: "PUT",
    form: profile,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-access-token': cookie.load('token')
    }
  };

  request(profileOpt, (error, resp, body) => {
    if (error) return cb(false, error);
    if (resp.statusCode !== 200) return cb(false, body);

    return cb(true, body);
  });
}
