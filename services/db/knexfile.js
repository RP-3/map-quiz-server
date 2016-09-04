module.exports = {

  dev: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      database: 'mapquiz'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds/scripts/'
    }
  },

  prod: {
    client: 'postgresql',
    connection: {
      database: 'mapquiz',
      host: '127.0.0.1',
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds/scripts/'
    }
  }

};
