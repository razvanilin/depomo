const passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = (app, route) => {

  passport.use(new FacebookStrategy({
    clientID: app.settings.facebook.client_id,
    clientSecret: app.settings.facebook.client_secret,
    callbackURL: app.settings.api_host + "/login/facebook"
  }, (accessToken, refreshToken, profile, cb) => {
    console.log("hey");
    console.log(profile);
    return cb(null, profile);
  }));

  passport.serializeUser(function(user, cb) {
    console.log("serializeUser");
    cb(null, user);
  });

  passport.deserializeUser(function(obj, cb) {
    console.log("deserializeUser");
    cb(null, obj);
  });

  app.use(passport.initialize());
  app.use(passport.session());

  /** Route to login using Facebook **/
  app.get("/oauth/facebook",
    passport.authenticate('facebook', {scope:'email'}), (req, res) => {
      console.log("hello");
    });

  app.get('/login/facebook',
  passport.authenticate('facebook', { failureRedirect: '/', successRedirect: app.settings.host + "/login" }),
  (req, res) => {
    console.log("hmm");
    // Successful authentication, redirect home.
  });

  return (req, res, next) => {
    next();
  }
}
