var fs = require('fs');

module.exports = function(config){

  var services = {};

  fs.readdirSync(__dirname).forEach(function(fileName){

    if(fileName.indexOf('.') === -1){

      var serviceName = fileName;
      services[fileName] = require(__dirname + '/' + fileName)(config[fileName]);

    }

  });

  return services;

};
