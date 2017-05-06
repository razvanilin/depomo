const checkAccess = require('../modules/checkAccess');
const verifyOwner = require('../modules/verifyOwner');
const mongoose = require('mongoose');
const request = require('request');
const moment = require('moment-timezone');
const getPaypalToken = require('../modules/getPaypalToken');
const makePayment = require('../modules/makePayment');
const fs = require('fs');

module.exports = (app, route) => {

  // prepare the models
  var User = mongoose.model('user', app.models.user);
  var Task = mongoose.model('task', app.models.task);

  /** Route to get user's tasks **/
  app.get('/task', verifyOwner, (req, res) => {
    var tasksExclusionFields = "-paymentId -payerId";
    Task.find({owner: req.query.userId}, tasksExclusionFields, (err, tasks) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }

      return res.status(200).send(tasks);
    });
  });
  // ---------------------------------------------------

  /** Route to record tasks **/
  app.post('/task', checkAccess, (req, res) => {
    if (!req.body._id || !req.body.label || !req.body.due || !req.body.deposit || !req.body.currency) {
      return res.status(400).send("Request body is incomplete. (_id, label, due, deposit, currency)");
    }

    var taskDue = moment(req.body.due);

    if (moment().diff(taskDue, 'minutes') > 0) {
      return res.status(400).send("Cannot set a date in the past");
    }

    User.findOne({_id: req.body._id}, (err, user) => {
      if (err) return res.status(400).send(err);
      if (!user) return res.status(404).send("Could not retrieve the user information");

      // prepare the document
      var taskDoc = {
        owner: req.body._id,
        label: req.body.label,
        deposit: req.body.deposit,
        due: req.body.due,
        currency: req.body.currency,
        method: "paypal"
      };

      // transform the date to UTC
      //taskDoc.due = moment.tz(taskDoc.due, "M/D/YYYY h:mm a", user.timezone).utc().format();

      Task.create(taskDoc, (error, task) => {
        if (error) return res.status(400).send(error);
        try {
          return res.status(200).send(task);
        } catch (e) {
          console.log(e);
          console.log(task);
          return res.status(400).send("Error parsing the response");
        }
      });
    });
  });
  // ---------------------------------------------------

  /** ROUTE to complete payment **/
  app.put('/task/:id/payment', verifyOwner, (req, res) => {
    Task.findOne({_id: req.params.id}, (err, task) => {
      if (err) return res.status(400).send(err);
      if (!task) return res.status(404).send("No task found with that ID");
      if (task.status !== 'failed' && task.status !== 'completed') return res.status(400).send("This task is not finished yet. Cannot process payment for it.");

      makePayment(app, task, (error, result) => {
        // update the task document
        Task.findByIdAndUpdate(task._id, {
          $set: {
            transactionStatus: result.payment.transaction.status,
            transactionId: result.payment.transaction.id
          }
        }, {new: true}, (err, task) => {

          if (err) {
            console.log(err);
            return res.status(400).send(err);
          }

          return res.status(200).send({task: task});
        });
      });
    });
  });
  // ---------------------------------------------------

  /** ROUTE to update tasks **/
  app.put('/task/:id', verifyOwner, (req, res) => {
    Task.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true}, (err, task) => {
      if (err) return res.status(400).send(err);
      if (!task) return res.status(404).send("No task found with that ID");

      return res.status(200).send(task);
    });
  });
  // ---------------------------------------------------

  /** ROUTE to mark activity as complete **/
  app.put('/task/:id/complete', verifyOwner, (req, res) => {

    Task.findByIdAndUpdate(req.params.id, {
      $set: {
        status: "completed"
      }
    }, {new: true}, (err, task) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }

      if (!task) return res.status(404).send("No task was found");

      if (req.body.donation && req.body.donation > 0) {
        task.deposit = req.body.donation;

        makePayment(app, task, (success, result) => {
          if (!success) {
            Task.findByIdAndUpdate(req.params.id, {
              $set: {
                transactionStatus: result.error
              }
            }, {new: true}, (err, errorTask) => {
              if (err) return res.status(400).send("Could not update the task.");
              return res.status(200).send(errorTask);
            });

          } else {
            Task.findByIdAndUpdate(req.params.id, {
              $set: {
                transactionStatus: result.payment.transaction.status,
                transactionId: result.payment.transaction.id,
                currency: result.payment.transaction.currencyIsoCode,
                donation: req.body.donation
              }
            }, {new: true}, (err, doneTask) => {
              if (err) return res.status(400).send(err);
              return res.status(200).send(doneTask);
            });
          }
        });
      } else {
        return res.status(200).send(task);
      }
    });
  });
  // ---------------------------------------------------

  /** ROUTE to remove a task **/
  app.put('/task/:id/remove', (req, res) => {
    Task.findOne({_id: req.params.id}, (err, task) => {
      if (err || !task) {
        return res.status(400).send("Could not retrieve the task information");
      }

      if (moment().diff(moment(task.createdAt), 'minutes') > 5) {
        return res.status(400).send("More than 5 minutes have past since the task was created. The task cannot be removed anymore");
      }

      Task.findByIdAndUpdate(req.params.id, {
        $set: {
          status: "deleted"
        }
      }, { new: true }, (err, task) => {
        if (err) return res.status(400).send(err);

        return res.status(200).send("Task removed");
      });
    });
  });
  // ---------------------------------------------------

  /** Webhook route for the Google calendar **/
  app.post("/task/webhook/google/:userId", (req, res) => {
    if (!req.get('x-goog-channel-id')) return res.status(400).send("request is missing headers.");

    User.findOne({
      _id: req.params.userId
    }, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }

      if (!user) {
        console.log("No user");
        return res.status(404).send("Cannot retrieve user information");
      }

      if (!user.googleNotificationChannel) {
        app.google.setCredentials({
          access_token: user.access_token,
          refresh_token: user.refresh_token,
          expiry_date: moment().add(30, 'days').format('x')
        });

        app.google.refreshAccessToken((err, tokens) => {
          if (err) return res.status(400).send("Cannot authenticate the request");
          // attempt to delete the channel if no user is using it
          app.calendar.channels.stop({
              id: req.get('x-goog-channel-id'),
              resourceId: req.get('x-goog-resource-id'),
              auth: app.google
          }, (err, result) => {
            if (err) {
              console.log(err);
              return res.status(400).send("Channel not found in the system. Could not stop it.")
            }
            console.log(result);
            return res.status(404).send("Channel not found in the system. Channel stopped.");
          });
        });
      } else {
        app.google.setCredentials({
          access_token: user.googleAccessToken,
          refresh_token: user.googleRefreshToken,
          // Optional, provide an expiry_date (milliseconds since the Unix Epoch)
          // expiry_date: (new Date()).getTime() + (1000 * 60 * 60 * 24 * 7)
          expiry_date: moment().add(30, 'days').format('x')
        });

        app.google.refreshAccessToken((err, tokens) => {

          var resUri = req.get('x-goog-resource-uri');
          var calendarId = resUri.substring(resUri.indexOf('calendars/'));
          calendarId = calendarId.replace('calendars/', '');
          calendarId = calendarId.substring(0, calendarId.indexOf('/events'));

          // get the event details
          app.calendar.events.list({
            calendarId: calendarId,
            timeMin: moment.tz().utc().format(),
            alwaysIncludeEmail: true,
            auth: app.google
          }, (err, response) => {
            if (err) {
              console.log(err);
              return res.status(400).send(err);
            }

            if (!response.items || response.items.length < 1) return res.status(404).send('No calendar entries detected');

            var calendarDepo = [];
            var foundIds = []; // for storing already processed IDs for avoiding creating the task twice
            // get depomo items
            for (var i=0; i<response.items.length; i++) {
              var eventSummary = response.items[i].summary ? response.items[i].summary.toLowerCase() : "";
              var eventDescription = response.items[i].description ? response.items[i].description.toLowerCase() : "";

              // search for the depomo keyword
              if (eventSummary.indexOf('depomo') > -1 || eventDescription.indexOf('depomo') > -1) {
                var found = false;
                for (var k=0; k<foundIds.length; k++) {
                  if (foundIds[k] === response.items[i].id) {
                    found = true;
                    break;
                  }
                }

                if (!found) {
                  calendarDepo.push(response.items[i]);
                }
              }
            }

            // go through all the found items and sync them with depomo
            for (var i=0; i<calendarDepo.length; i++) {
              var event = calendarDepo[i];

              var deposit = event.summary.substring(event.summary.toLowerCase().indexOf('depomo'));
              // extract the deposit from the summary
              var finalDepo = '';
              for (var s=0; s<deposit.length; s++) {
                // if the char is a number add it to the result
                if (!isNaN(deposit[s]) && deposit[s] !== " ") {
                  finalDepo += deposit[s];
                } else if (isNaN(deposit[s]) && (deposit[s] !== '.' && deposit[s] !== ',') && finalDepo.length > 0) {
                  // break if the deposit is populated with some numbers and a non number char is detected afterwards
                  // also check for . and , because some people might use that as a delimiter
                  break;
                } else if ((deposit[s] === '.' || deposit[s] === ',') && finalDepo.length > 0 && finalDepo.indexOf(".") > -1) {
                   break;
                } else if ((deposit[s] === '.' || deposit[s] === ',') && finalDepo.length > 0 && finalDepo.indexOf(".") === -1) {
                  // dot for decimals
                  finalDepo += ".";
                }
              }

              if (!finalDepo || finalDepo.length < 1) {
                return;
              }

              var parsedFinalDepo = parseFloat(finalDepo);

              if (isNaN(parsedFinalDepo)) return;

              var newTask = {
                label: event.summary,
                due: moment.tz(event.start.dateTime, "Europe/London").utc().format(),
                deposit: parsedFinalDepo,
                currency: "USD",
                googleId: event.id,
                owner: req.params.userId
              };

              createTask(newTask);

            }

            return res.status(200).send(calendarDepo);
          });
        });
      }
    });
  });
  // ---------------------------------------------------

  function createTask(newTask) {
    Task.findOne({googleId: newTask.googleId}, (err, task) => {
      if (err || task) return;

      if (!task) {
        Task.create(newTask, (err, task) => {
          if (err) console.log(err);
          console.log(task);
        });
      }
    });
  }

  return (req, res, next) => {
    next();
  }
}
