module.exports = {
  '/user': require('./controllers/UserController'),
  '/task': require('./controllers/TaskController'),
  '/payment': require('./controllers/PaymentController'),
  '/mailchimp': require('./controllers/MailchimpController')
}
