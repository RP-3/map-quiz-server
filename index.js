//initialise express and services
const config = require('./config.js');
const services = require('./services')(config);
const express = require('express');
const app = express();

app.enable('trust proxy'); //because we want to use sessions behind nginx

//add global middleware
const logger = require('morgan');
const bodyParser = require('body-parser');

app.use(services.logger.autoLogger('dev'));
app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  next();

});
app.use(bodyParser.json());

//initialise and add services
const apiRouter = require('./routes/index.js')(services);
app.use('/api', apiRouter);

// app.use('/', function(req, res, next){
//   console.log(req.body);
//   console.log(req.body.game ? req.body.game.attempts : '');
//   return res.status(200).send({
//     user_id: req.body.user_id,
//     user_secret: uuid()
//   });
// });

//start listening
app.listen(config.express.port, function () {
  console.log('mapQuiz app server listening on port ' + config.express.port);
});
