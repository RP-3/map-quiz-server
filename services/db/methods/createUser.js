const Promise = require('bluebird');

module.exports = function(knex){

  return function(params){

    return Promise.try(function(){

      if(!params.user_id) throw new Error('user_id must be provided');
      return params.user_id;

    })
    .then(function(userId){

      return knex('users')
      .insert({user_id: userId})
      .returning(['user_id', 'user_secret']);

    })
    .then(function(accounts){

      return {
        user_id: accounts[0].user_id,
        user_secret: accounts[0].user_secret
      };

    });

  };

};
