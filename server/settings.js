
module.exports = {
  dbhost: process.env.DEPOMO_DB,
  port: 3010,
  host: "http://depomo.com",
  api_host: "http://api.depomo.com",
  secret: process.env.DEPOMO_SECRET,
  paypal: {
    mode: "sandbox",
    client_id: process.env.DEPOMO_PAYPAL_ID,
    secret: process.env.DEPOMO_PAYPAL_SECRET
  },
  mailchimp: {
    host: "https://us8.api.mailchimp.com/3.0",
    api_key: process.env.MAILCHIMP_API_KEY,
    general_list: "2a60530976"
  },
  mandrill: {
    api_key: process.env.MANDRILL_API_KEY,
    welcome_template: "depomo-welcome"
  },
  facebook: {
    client_id: process.env.FACEBOOK_ID,
    client_secret: process.env.FACEBOOK_SECRET
  },
  braintree: {
    merchant_id: process.env.BRAINTREE_MERCHANT_ID,
    private_key: process.env.BRAINTREE_PRIVATE_KEY,
    public_key: process.env.BRAINTREE_PUBLIC_KEY
  }
}
