module.exports = (app, route) => {

  /** Route to get all the users **/
  app.get('/user', (req, res) => {
    
  });

  /** Route to get a user **/
  app.get('/user/:id', (req, res) => {

  });

  /** Route to create a user **/
  app.post('/user', (req, res) => {

  });

  return (req, res, next) => {
    next();
  }
}
