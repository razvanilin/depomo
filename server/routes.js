module.exports = {
  '/user': require('./controllers/UserController'),
  '/task': require('./controllers/TaskController'),
  '/payment': require('./controllers/PaymentController'),
  '/social': require('./controllers/SocialController'),
  '/mailchimp': require('./controllers/MailchimpController')
}
