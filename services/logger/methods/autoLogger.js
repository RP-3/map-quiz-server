const logger = require('morgan');

module.exports = function(){

  logger.token("ip", function(request) {

    var retval = "";
    if (request.headers && request.headers["x-forwarded-for"]) {
      // Proxied request
      retval = request.headers["x-forwarded-for"];
    } else if (request.socket && request.socket.remoteAddress) {
      // Direct request
      retval = request.socket.remoteAddress;
    } else if (request.socket && request.socket.socket && request.socket.socket.remoteAddress) {
      // God only knows what happened here...
      retval = request.socket.socket.remoteAddress;
    }
    return(retval);

  });

  logger.format('dev', function developmentFormatLine (tokens, req, res) {
    // get the status code if response written
    var status = res._header ? res.statusCode : undefined;

    // get status color
    var color = status >= 500 ? 31 // red
      : status >= 400 ? 33 // yellow
      : status >= 300 ? 36 // cyan
      : status >= 200 ? 32 // green
      : 0; // no color

    // get colored function
    var fn = developmentFormatLine[color];

    if (!fn) {
      // compile
      fn = developmentFormatLine[color] = logger.compile('[:date[clf]] \x1b[0m:method :url \x1b[' + color + 'm:status \x1b[0m:response-time ms - :res[content-length]\x1b[0m :ip');
    }

    return fn(tokens, req, res);
  });

  return logger;

};
