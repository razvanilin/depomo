const request = require('request');

import cookie from 'react-cookie'
import settings from '../settings'
import userState from '../state/user'

export default function changeProfile(profile, userId, cb) {

  if (!cookie.load('token')) return cb(false, "Invalid token");
  if (!profile) return cb(false, "No profile information found");

  // make a copy of the profile object
  profile = JSON.parse(JSON.stringify(profile));

  if (profile.timezone) {
    profile.timezone = profile.timezone.substring(0, profile.timezone.indexOf(" ("));
    profile.timezone = profile.timezone.replace(" ", "_");
  }

  if (profile.offsetType === 'hours') {
    profile.reminderOffset *= 60;
  } else if (profile.offsetType === 'days') {
    profile.reminderOffset *= 24*60;
  }

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

    let newUser;
    try {
      newUser = JSON.parse(body);
    } catch (e) {
      newUser = body;
    }

    // set new user in the state
    userState.set(newUser);

    return cb(true, newUser);
  });
}
