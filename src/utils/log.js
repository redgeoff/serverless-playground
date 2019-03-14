// Note: we cannot use Typescript as we need to run this from the jest globalSetup

const bunyan = require('bunyan');

const log = bunyan.createLogger({ name: 'serverless-playground', src: true, serializers: bunyan.stdSerializers });

if (process.env.NODE_ENV === 'test') {
  // Silence the log for testing
  log.level('fatal');
}

module.exports = log;