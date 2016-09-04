const Promise = require('bluebird');
const moment = require('moment');

module.exports = function(knex){

  return function(params, userId){

    var savedGame;

    return Promise.try(function(){

      if(!params.user_id)         throw new Error('user_id must be provided');
      if(!params.game)            throw new Error('game must be provided');
      if(!params.game.continent)  throw new Error('game continent must be provided');
      if(!params.game.mode)       throw new Error('game mode must be provided');
      if(!params.game.created_at) throw new Error('game created_at must be provided');
      if(!params.game.attempts)   throw new Error('game attempts must be provided');
      if(params.game.identifier)  throw new Error('game already exists');

      if(params.game.mode.toLowerCase() === 'challenge'){
        if(!params.game.lives_left) throw new Error('game lives_left must be provided for challenge mode');
        if(params.game.lives_left < 1) throw new Error('game lives_left must be provided > 0 in chellenge mode');
        if(!params.game.match_length) throw new Error('game match_length must be provided');
      }else{
        if(!params.game.finished_at) throw new Error('game finished_at must be provided');
        params.game.lives_left = null;
        params.game.match_length = moment(params.game.finished_at)
        .subtract(moment(params.game.created_at))
        .seconds();
      }

      if(!Array.isArray(params.game.attempts)) throw new Error('game attempts must be a JSON array');

      return knex.transaction(function(trx){

        //get continent_id
        return trx('continents')
        .select('id')
        .where({code: params.game.continent})
        //insert game
        .then(function(continentIds){

          if(continentIds.length !== 1){
            throw new Error("continent code '" + params.game.continent + "' does not exist.");
          }

          return trx('games')
          .insert({
            user_id: userId,
            continent_id: continentIds[0].id,
            lives_remaining: params.game.lives_left,
            length_in_seconds: params.game.match_length,
            challenge: params.game.mode.toLowerCase() === 'challenge' ? true : false,
            started_at: params.game.created_at
          })
          .returning('*');

        })
        //get countries relevant to game
        .then(function(savedGames){

          savedGame = savedGames[0];

          return trx
          .select('countries.name', 'countries.id')
          .from('countries')
          .join('continents', 'continents.id', 'countries.continent_id')
          .where({'continents.code': params.game.continent});

        })
        //format countries
        .then(function(countriesInGame){

          countryIndex = {};
          countriesInGame.forEach(function(countryHash){
            countryIndex[countryHash.name] = countryHash.id;
          });

          var attempts = params.game.attempts.map(function(attempt){

            if(!attempt.countryGuessed)        throw new Error('attempt countryGuessed must be provided;');
            if(!attempt.countryToFind)         throw new Error('attempt countryToFind must be provided;');
            if(!attempt.created_at)            throw new Error('attempt created_at must be provided;');
            if(attempt.revealed === undefined) throw new Error('attempt revealed must be provided;');

            return {
              user_id: userId,
              game_id: savedGame.id,
              country_to_find_id: countryIndex[attempt.countryToFind],
              country_guessed_id: countryIndex[attempt.countryGuessed],
              revealed: params.game.mode.toLowerCase() === 'chellenge' ? null : attempt.revealed,
              attempted_at: attempt.created_at
            };

          });

          return trx('attempts')
          .insert(attempts)
          .returning('*');

        })
        //get rank if saved game is a challenge
        .then(function(){

          if(savedGame.challenge){

            var q = [];
            q.push("WITH rank AS (");
            q.push("  SELECT t.*,");
            q.push("    ROW_NUMBER() OVER(ORDER BY t.lives_remaining DESC, t.length_in_seconds ASC) AS position");
            q.push("  FROM games t WHERE challenge = TRUE)");
            q.push("SELECT s.*");
            q.push("  FROM rank s");
            q.push("WHERE s.identifier = '" + savedGame.identifier + "';");
            q = q.join(' ');

            return trx.raw(q);

          }

        });

      });

    })
    .then(function(resp){

      return {
        identifier: savedGame.identifier,
        rank: resp.rows[0].position
      };

    });

  };

};
