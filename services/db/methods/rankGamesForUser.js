const Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(knex){

  return function(userId){

    return Promise.try(function(){

      return knex('games')
      .select('identifier', 'continent_id')
      .where({
        user_id: userId,
        challenge: true
      });

    })
    .then(function(identifiers){

      continents = {};
      identifiers.forEach(function(obj){
        if(!continents[obj.continent_id]) continents[obj.continent_id] = [];
        continents[obj.continent_id].push("'" + obj.identifier + "'");
      });

      var continentArray = [];
      for(var key in continents){
        continentArray.push({
          continent_id: key,
          identifiers: continents[key]
        });
      }

      return Promise.map(continentArray, function(continent){

        var ids = continent.identifiers.join(', ');

        var q = [];
        q.push("WITH rank AS (");
        q.push("  SELECT t.*,");
        q.push("    ROW_NUMBER() OVER(ORDER BY t.lives_remaining DESC, t.length_in_seconds ASC) AS position");
        q.push("  FROM games t WHERE challenge = TRUE AND continent_id = " + continent.continent_id + ")");
        q.push("SELECT s.*");
        q.push("  FROM rank s");
        q.push("WHERE s.identifier IN (" + ids + ");");
        return knex.raw(q.join(' '));

      });


    })
    .then(function(results){

      var response = results.map(function(result){
        return result.rows.map(function(row){
          return {
            identifier: row.identifier,
            rank: row.position
          };
        });
      });

      return _.flatten(response);

    });

  };

};
