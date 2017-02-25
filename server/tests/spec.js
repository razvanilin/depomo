var request = require('supertest');
//require = require('really-need');
describe('loading express', () => {
  var server;
  var db;
  beforeEach(() => {
    delete require.cache[require.resolve('../index')];
    var index = require("../index");
    server = index.server;
    db = index.db;
  });
  afterEach((done) => {
    db.connection.close();
    server.close(done);
  });

  /** testing the routes **/

  // get all users
  it('responds to GET /user', function testSlash(done) {
    request(server)
      .get('/user')
      .expect(200, done);
  });

  // get specific user
  it('responds to GET /user/:id', function testSlash(done) {
    request(server)
      .get('/user/1')
      .expect(200, done);
  });

  /** POST to /user **/
  it('responds to POST /user', function testSlash(done) {
    request(server)
      .post('/user')
      .send({
        email: "raz@razvanilin.com",
        password: "password"
      })
      .expect(200, done);
  });

  it('misses the email field on POST /user', function testSlash(done) {
    request(server)
    .post('/user')
    .send({
      password: "password"
    })
    .expect(400, done);
  });

  it('misses the password field on POST /user', function testSlash(done) {
    request(server)
    .post('/user')
    .send({
      email: "raz@razvanilin.com"
    })
    .expect(400, done);
  });

  it('must be longer than 6 characters on POST /user', (done) => {
    request(server)
    .post('/user')
    .send({
      email: "raz@razvanilin.com",
      password: "pass"
    })
    .expect(400, done);
  });
  // -----------------------------------------------------

  it('doesn\'t find the controller', function testSlash(done) {
    request(server)
      .get('/nope')
      .expect(404, done);
  });
})
