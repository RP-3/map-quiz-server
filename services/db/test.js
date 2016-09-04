var mocha = require('mocha'),
    chai = require('chai'),
    expect = chai.expect,
    should = chai.should,
    assert = chai.assert,
    Promise = require('bluebird'),
    moment = require('moment'),
    db = require('./index.js')({
      //postgres
      client: 'pg',
      connection: {
        host: '127.0.0.1',
        database: 'mapquiz'
      }
    });

var uuidMatcher = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
function uuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return [s4()+s4(), s4(), s4(), s4(), s4() + s4() + s4()].join('-');
}
function isNumeric(num){
  return !isNaN(num) && isFinite(num);
}

describe('db', function(){

  var user = {};
  var userId;

  describe('createUser', function(){

    it('should create a uuid for a given user', function(){

      var id = uuid();
      return db.createUser({
        user_id: id
      })
      .then(function(resp){
        expect(resp.user_id).to.equal(id);
        expect(resp.user_secret.match(uuidMatcher).length).to.equal(1);
        user.user_id = resp.user_id;
        user.user_secret = resp.user_secret;
      });

    });

    it('reject when missing a user_id', function(){

      return db.createUser({
        user_id: ''
      })
      .then(function(resp){
        throw new Error('Expected user creation to fail.');
      })
      .catch(function(err){
        return expect(err.message).to.equal("user_id must be provided");
      });

    });

  });

  describe('authenticateUser', function(){

    it('should authenticate an extant user', function(){

      return db.authenticateUser(user)
      .then(function(user){
        expect(Object.prototype.toString.call(user.id)).to.equal('[object Number]');
        userId = user.id;
      });

    });

    it('should not authenticate a fake user', function(){

      return db.authenticateUser({user_id: user.user_id, user_secret: 'boo'})
      .then(function(user){
        throw new Error('Expected user authentication to fail.');
      })
      .catch(function(err){
        return expect(err.message).to.equal("Invalid credentials");
      });

    });

  });

  describe('addGameForUser', function(){

    var newGamePayload;
    before(function(){
      newGamePayload = {
        user_id: user.user_id,
        user_secret: user.user_secret,
        game:
         { created_at: '2016-09-04 14:28:28 +0000',
           mode: 'challenge',
           match_length: 60 + Math.floor(Math.random() * 60 * 4),
           continent: 'AS',
           lives_left: Math.ceil(Math.random() * 3),
           attempts:
            []
          }
      };
    });

    it('should create a game for a user', function(){

      return db.addGameForUser(newGamePayload, userId)
      .then(function(resp){
        expect(resp.identifier.match(uuidMatcher).length).to.equal(1);
        expect(isNumeric(resp.rank)).to.equal(true);
      });

    });

  });

  describe('rankGamesForUser', function(){

    return db.rankGamesForUser(1)
    .then(function(resp){
      expect(resp.length > 0).to.equal(true);
      resp.forEach(function(hash){
        expect(hash.identifier.match(uuidMatcher).length).to.equal(1);
        expect(isNumeric(hash.rank)).to.equal(true);
      });
    });

  });

});
