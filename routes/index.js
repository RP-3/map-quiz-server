var express = require('express');

module.exports = function(services){

  var router = express.Router();

  router.post('/users/games', function(req, res, next){

    return services.db.authenticateUser({
      user_id: req.body.user_id,
      user_secret: req.body.user_secret
    })
    .then(function(user){
      return db.rankGamesForUser(req.body, user.id);
    })
    .then(function(data){
      return res
      .status(200)
      .json(data);
    })
    .catch(function(err){
      services.logger.log(err);
      res
      .status(400)
      .send(err.message);
    });

  });

  router.put('/users/games', function(req, res, next){

    return services.db.authenticateUser({
      user_id: req.body.user_id,
      user_secret: req.body.user_secret
    })
    .then(function(user){
      return db.rankGamesForUser(user.id);
    })
    .then(function(data){
      return res
      .status(200)
      .json(data);
    })
    .catch(function(err){
      services.logger.log(err);
      res
      .status(400)
      .send(err.message);
    });

  });

  router.post('/users', function(req, res, next){

    return services.db.createUser({user_id: req.body.user_id})
    .then(function(data){
      return res
      .status(200)
      .json(data);
    })
    .catch(function(err){
      services.logger.log(err);
      res
      .status(400)
      .send(err.message);
    });

  });

  return router;

};
