// TODO: move core logic to utils

// Note: this code is pure JS as Jest does not currently support babel for the globalSetup &
// globalTeardown

module.exports = async () => {
  // Not running unit tests? Don't start API if running just unit tests
  if (!process.env.RUNNING_UNIT_TESTS) {
    global.slsOfflineProcess.kill();
    console.log('Serverless Offline stopped');
  }
};