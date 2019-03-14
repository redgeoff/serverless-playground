// TODO: move core logic to utils

// Credit: inspired by
// https://medium.com/@justintulk/how-to-mock-an-external-library-in-jest-140ac7b210c2

// Note: this code is pure JS as Jest does not currently support babel for the globalSetup &
// globalTeardown

const { spawn } = require('child_process')
const log = require('./src/utils/log');

const config = require('./src/config-test')

async function startSlsOffline() {
  return new Promise((resolve, reject) => {
    global.slsOfflineProcess = spawn('sls', ['offline', 'start', '--port', config.port]);

    console.log(`\nServerless: Offline started with PID: ${slsOfflineProcess.pid}`);

    slsOfflineProcess.stdout.on('data', (data) => {
      if (data.includes('Offline listening on')) {
        console.log(data.toString().trim());
        resolve();
      }
    });

    slsOfflineProcess.stderr.on('data', (errData) => {
      console.error(`Error starting Serverless Offline:\n${errData}`);
      reject(errData);
    });
  });
}

module.exports = async () => {
  // Not running unit tests? Don't start API if running just unit tests
  if (!process.env.RUNNING_UNIT_TESTS) {
    return startSlsOffline();
  }
}