const moment = require('moment');

module.exports = function(config){

  const format = config.format;

  return function(){

    const time = [moment().format(format) + ':: '];
    console.log.apply(null, time.concat(Array.prototype.slice.call(arguments)));

  };

};
