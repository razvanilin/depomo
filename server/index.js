const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const _ = require('lodash');
const cors = require('cors');
const paypal = require('paypal-rest-sdk');
const checkTasks = require('./modules/checkTasks');
const moment = require('moment');
const mandrill = require('mandrill-api/mandrill');
const braintreeSdk = require('braintree');

var CronJob = require('cron').CronJob;

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

// configure braintree
app.braintree = braintreeSdk.connect({
    environment:  braintreeSdk.Environment.Sandbox,
    merchantId:   app.settings.braintree.merchant_id,
    publicKey:    app.settings.braintree.public_key,
    privateKey:   app.settings.braintree.private_key
});

// configure mandrill
app.mandrill = new mandrill.Mandrill(app.settings.mandrill.api_key);

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
  // starting the cron-job to check out tasks
  console.log("Starting cron...");
  new CronJob('0 */1 * * * *', () => {
    console.log(moment().format('MMMM Do YYYY, h:mm:ss a') + " - Running Cron");
    checkTasks(app);
  }, () => {
    console.log("Cron Stop");
  }, true);
});

module.exports = {
  server: server,
  db: mongoDB
};
