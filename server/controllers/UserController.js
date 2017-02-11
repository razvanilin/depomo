module.exports = (app, route) => {

  /** Route to get all the users **/
  app.get('/user', (req, res) => {
    return res.status(200).send("GET /user works");
  });

  /** Route to get a user **/
  app.get('/user/:id', (req, res) => {
    return res.status(200).send("GET /user/:id works");
  });

  /** Route to create a user **/
  app.post('/user', (req, res) => {
    return res.status(200).send("POST /user works");
  });

  return (req, res, next) => {
    next(); 
  }
}
