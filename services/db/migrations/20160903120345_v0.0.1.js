
exports.up = function(knex, Promise) {

  return knex.schema.createTable('users', function(t){

    t.increments()
      .index();
    t.string('user_id')
      .notNullable()
      .index();
    t.string('user_secret')
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .index()
      .notNullable();
    t.timestamp('created_at')
      .index()
      .notNullable()
      .defaultTo(knex.fn.now());

    t.unique('user_id');
    t.unique('user_secret');

  })
  .then(function(){

    return knex.schema.createTable('continents', function(t){
      t.increments()
        .index();
    })
    .then(function(t){
      return knex.schema.raw("ALTER TABLE continents ADD COLUMN name citext UNIQUE NOT NULL");
    })
    .then(function(t){
      return knex.schema.raw("ALTER TABLE continents ADD COLUMN code citext UNIQUE NOT NULL");
    })
    .then(function(t){
      return knex.schema.table('continents', function(t){
         t.index('code');
         return t.index('name');
      });
    });

  })
  .then(function(){

    return knex.schema.createTable('countries', function(t){

      t.increments()
        .index();
      t.integer('continent_id')
        .index()
        .references('id')
        .inTable('continents')
        .notNullable();

    })
    .then(function(t){
      return knex.schema.raw("ALTER TABLE countries ADD COLUMN name citext UNIQUE NOT NULL");
    })
    .then(function(t){
      return knex.schema.table('countries', function(t){
         return t.index('name');
      });
    });

  })
  .then(function(){

    return knex.schema.createTable('games', function(t){

      t.increments()
        .index();
      t.string('identifier')
        .defaultTo(knex.raw("uuid_generate_v4()"))
        .index()
        .notNullable();
      t.integer('user_id')
        .index()
        .references('id')
        .inTable('users')
        .notNullable();
      t.integer('continent_id')
        .index()
        .references('id')
        .inTable('continents')
        .notNullable();
      t.integer('lives_remaining')
        .index()
        .notNullable();
      t.integer('length_in_seconds')
        .index()
        .notNullable();
      t.boolean('challenge')
        .index()
        .notNullable();
      t.timestamp('started_at')
        .index()
        .notNullable();

    });

  })
  .then(function(){

    return knex.schema.createTable('attempts', function(t){

      t.increments()
        .index();
      t.integer('user_id')
        .index()
        .references('id')
        .inTable('users')
        .notNullable();
      t.integer('game_id')
        .index()
        .references('id')
        .inTable('games')
        .notNullable();
      t.integer('country_to_find_id')
        .index()
        .references('id')
        .inTable('countries')
        .notNullable();
      t.integer('country_guessed_id')
        .index()
        .references('id')
        .inTable('countries');
      t.boolean('revealed')
        .index()
        .notNullable();
      t.timestamp('attempted_at')
        .notNullable()
        .defaultTo(knex.fn.now());

    });

  });

};

exports.down = function(knex, Promise) {

  return knex.schema.dropTable('attempts')
  .then(function(){
    return knex.schema.dropTable('games');
  })
  .then(function(){
    return knex.schema.dropTable('countries');
  })
  .then(function(){
    return knex.schema.dropTable('continents');
  })
  .then(function(){
    return knex.schema.dropTable('users');
  });

};
