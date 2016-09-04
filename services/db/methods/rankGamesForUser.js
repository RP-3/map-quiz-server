const Promise = require('bluebird');

module.exports = function(knex){

  return function(userId){

    return Promise.try(function(){

      return knex('games')
      .select('identifier')
      .where({
        user_id: userId,
        challenge: true
      });

    })
    .then(function(identifiers){

      ids = identifiers.map(function(obj){
        return "'" + obj.identifier + "'";
      }).join(', ');

      var q = [];
      q.push("WITH rank AS (");
      q.push("  SELECT t.*,");
      q.push("    ROW_NUMBER() OVER(ORDER BY t.lives_remaining DESC, t.length_in_seconds ASC) AS position");
      q.push("  FROM games t WHERE challenge = TRUE)");
      q.push("SELECT s.*");
      q.push("  FROM rank s");
      q.push("WHERE s.identifier IN (" + ids + ");");
      return knex.raw(q.join(' '));

    })
    .then(function(results){

      return results.rows.map(function(row){
        return {
          identifier: row.identifier,
          rank: row.position
        };
      });

    });

  };

};
