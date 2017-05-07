import cookie from 'react-cookie'
import settings from '../settings'

const request = require('request');

function getQueryStringValue (key) {
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}


export default function getGoogleCalendarList(user, cb) {
  var code = getQueryStringValue('code');
  var state = getQueryStringValue('state');

  if (!code) return cb();

  var options = {
    url: settings.api_host + "/social/oauth/google?state=" + state + "&code=" + code + "&userId=" + user._id,
    method: "GET",
    headers: {
      'x-access-token': cookie.load('token'),
      'Accept': 'application/json'
    }
  };

  request(options, (error, resp, body) => {
    if (error) return cb(error);
    if (resp.statusCode !== 200) {
      return cb(body);
    }

    try {
      return cb(null, JSON.parse(body));
    } catch (e) {
      return cb(e);
    }
  })
}
