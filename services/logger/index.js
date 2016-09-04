const log = require('./methods/log.js');
const autoLogger = require('./methods/autoLogger.js');

module.exports = function(config){

  return {
    log: log(config),
    autoLogger: autoLogger()
  };

};
