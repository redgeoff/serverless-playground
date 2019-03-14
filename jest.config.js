module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  modulePathIgnorePatterns: [
    'node_modules'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,js}'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  globalSetup: '<rootDir>/setup.js',
  globalTeardown: '<rootDir>/teardown.js'
};