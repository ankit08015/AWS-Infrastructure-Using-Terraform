// var appRoot = require('app-root-path');
// var winston = require('winston');

// var options = {
//     infoFile: {
//       level: 'info',
//       filename: `${appRoot}/logs/info.log`,
//       handleExceptions: true,
//       json: true,
//       maxsize: 5242880, // 5MB
//       maxFiles: 5,
//       colorize: false,
//     },

//     errorFile: {
//       level: 'error',
//       filename: `${appRoot}/logs/error.log`,
//       handleExceptions: true,
//       json: true,
//       maxsize: 5242880, // 5MB
//       maxFiles: 5,
//       colorize: false,
//     }
//   };
  
//   // instantiate a new Winston Logger with the settings defined above
//   var logger = new winston.createLogger({
//     transports: [
//       new winston.transports.File(options.infoFile),
//       new winston.transports.File(options.errorFile)
//     ],
//     exitOnError: false, // do not exit on handled exceptions
//   });
  
//   // create a stream object with a 'write' function that will be used by `morgan`
//   logger.stream = {
//     write: function(message, encoding) {
//       // use the 'info' log level so the output will be picked up by both transports (file and console)
//       logger.info(message);
//     },
//   };
  
//   module.exports = logger;