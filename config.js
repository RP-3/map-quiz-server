module.exports = {

  express: {
    port: 5000
  },

  db: {
    //postgres
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      //user: 'sarith21',
      database: 'mappify_accounts'
    }
    //port: 5432 //not required... smart PG default?
  },

  logger: {
    //moment
    format: 'dddd MMMM Do YYYY, h:mm:ss a'
  }

};
