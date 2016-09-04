var createUser = require('./methods/createUser');
var authenticateUser = require('./methods/authenticateUser');
var addGameForUser = require('./methods/addGameForUser');
var rankGamesForUser = require('./methods/rankGamesForUser');

module.exports = function(config){

  var knex = require('knex')({
    client: config.client,
    connection: {
      host     : config.connection.host,
      database : config.connection.database
    }
  });

  return {
    createUser: createUser(knex),
    authenticateUser: authenticateUser(knex),
    addGameForUser: addGameForUser(knex),
    rankGamesForUser: rankGamesForUser(knex),
  };

};
