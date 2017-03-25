const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const _ = require('lodash');
const cors = require('cors');
const paypal = require('paypal-rest-sdk');

var app = express();
var http = require('http').Server(app);

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(cors());

// get the environment specific settings
if (process.env.NODE_ENV == "production") {
  app.settings = require('./settings');
} else {
  app.settings = require('./settings-dev');
}

app.get('/', function(req, res, next) {
  return res.send("Welcome to depomo server API");
});

// configure paypal
paypal.configure({
  mode: app.settings.paypal.mode,
  client_id: app.settings.paypal.client_id,
  client_secret: app.settings.paypal.secret
});
app.paypal = paypal;

// Connect to mongodb
var mongoDB = mongoose.connect(app.settings.dbhost);
mongoose.connection.once('open', function() {

});

// Load the models
app.models = require('./models/index');

// Load the routes
var routes = require('./routes');
_.each(routes, function(controller, route) {
  app.use(route, controller(app, route));
})

var server = app.listen(app.settings.port, function() {
  //console.log('Listening on port ' + app.settings.port);
});

module.exports = {
  server: server,
  db: mongoDB
};
