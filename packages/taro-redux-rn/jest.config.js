module.exports = {
  verbose: true,
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  setupTestFrameworkScriptFile: 'jest-enzyme',
  testEnvironment: 'enzyme',
  testEnvironmentOptions: {
    enzymeAdapter: 'react16'
  }
}
