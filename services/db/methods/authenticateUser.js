const Promise = require('bluebird');

module.exports = function(knex){

  return function(params){

    return Promise.try(function(){

      if(!params.user_id) throw new Error('user_id must be provided');
      if(!params.user_secret) throw new Error('user_secret must be provided');

      return knex('users')
      .select('id')
      .where({
        user_id: params.user_id,
        user_secret: params.user_secret
      });

    })
    .then(function(accounts){

      if(!accounts.length) throw new Error('Invalid credentials');

      return {
        id: accounts[0].id,
      };

    });

  };

};
