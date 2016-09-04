var Promise = require('bluebird');

exports.seed = function(knex, Promise) {

  //clear out existing data
  return knex('countries')
  .del()
  .then(function(){
    return knex('continents')
    .del();
  })
  //insert new data
  .then(function(){

    var continentArray = require('../data/continents')
    .map(function(continent){
      return {
        name: continent.name,
        code: continent.code
      };
    });

    return knex.table('continents')
    .insert(continentArray)
    .returning(['id', 'name']);

  })
  //insert countries
  .then(function(continentArray){

    var continentIdsKeyedByName = {};
    continentArray.forEach(function(continentHash){
      continentIdsKeyedByName[continentHash.name] = continentHash.id;
    });

    var countriesToInsert = require('../data/countries')
    .map(function(countryHash){
      return {
        name: countryHash.country,
        continent_id: continentIdsKeyedByName[countryHash.continent]
      };
    });

    return knex.table('countries')
    .insert(countriesToInsert);

  });

};
