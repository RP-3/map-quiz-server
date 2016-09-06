module.exports = {

  express: {
    port: 8080
  },

  db: {
    //postgres
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      database: 'mapquiz'
    }
  },

  logger: {
    //moment
    format: 'dddd MMMM Do YYYY, h:mm:ss a'
  }

};
