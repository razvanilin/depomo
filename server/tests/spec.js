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

  // create a new user
  it('responds to POST /user', function testSlash(done) {
    request(server)
      .post('/user')
      .expect(200, done);
  });

  it('doesn\'t find the controller', function testSlash(done) {
    request(server)
      .get('/nope')
      .expect(404, done);
  });
})
