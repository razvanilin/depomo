var request = require('supertest');
const assert = require('assert');
//require = require('really-need');
describe('loading express', () => {
  var server;
  var db;
  var currentUser = {};
  var otherUser = {};

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
  it('is not allowed access to route', function testSlash(done) {
    request(server)
      .get('/user/1')
      .expect(401, done);
  });

  /** POST to /user **/
  it('creates first user', function testSlash(done) {
    request(server)
      .post('/user')
      .send({
        email: "raz@razvanilin.com",
        password: "password"
      })
      .expect(200, done);
  });

  it('creates other user', (done) => {
    request(server)
    .post('/user')
    .send({
      email: "otherRaz@razvanilin.com",
      password: "password"
    })
    .expect(200, done);
  });

  it('misses the email field user creation', function testSlash(done) {
    request(server)
    .post('/user')
    .send({
      password: "password"
    })
    .expect(400, done);
  });

  it('misses the password field on user creation', function testSlash(done) {
    request(server)
    .post('/user')
    .send({
      email: "raz@razvanilin.com"
    })
    .expect(400, done);
  });

  it('must be longer than 6 characters on user creation', (done) => {
    request(server)
    .post('/user')
    .send({
      email: "raz@razvanilin.com",
      password: "pass"
    })
    .expect(400, done);
  });

  it('logs the user in', (done) => {
    request(server)
    .post('/user/login')
    .send({
      email: "raz@razvanilin.com",
      password: "password"
    })
    .end( (err, result) => {
      assert.equal(result.statusCode, "200")
      assert.equal(result.body.email, "raz@razvanilin.com");
      currentUser = result.body;
      done();
    });
  });

  it('logs other user in', (done) => {
    request(server)
    .post('/user/login')
    .send({
      email: "otherRaz@razvanilin.com",
      password: "password"
    })
    .end( (err, result) => {
      assert.equal(result.statusCode, "200");
      assert.equal(result.body.email, "otherRaz@razvanilin.com")
      otherUser = result.body;
      done();
    });
  });

  it("fails to log in the user because the password is wrong", (done) => {
    request(server)
    .post('/user/login')
    .send({
      email: "raz@razvanilin.com",
      password: "wrongpassword"
    }).expect(401, done);
  });

  it("fails to log in the user because the email is wrong", (done) => {
    request(server)
    .post("/user/login")
    .send({
      email: "something@razvanilin.com",
      password: "password"
    })
    .expect(401, done);
  });

  // get specific user
  it('is allowed to get its own user information', function testSlash(done) {
    request(server)
      .get('/user/' + currentUser._id)
      .query({token: currentUser.token})
      .expect(200, done);
  });

  it('is not allowed access to its own user information because the token is not valid', (done) => {
    request(server)
    .get('/user/' + currentUser._id)
    .query({token: "notValid:("})
    .expect(401, done);
  });

  it('restricts access from other user details', (done) => {
    request(server)
    .get('/user/' + currentUser._id)
    .query({token: otherUser.token})
    .expect(401, done);
  });
  // -----------------------------------------------------


  it('doesn\'t find the controller', function testSlash(done) {
    request(server)
      .get('/nope')
      .expect(404, done);
  });
})
