module.exports = {
  testMatch: ['<rootDir>/__test__/**/*-test.js'],
  setupFiles: ['jest-localstorage-mock'],
  setupTestFrameworkScriptFile: 'jest-mock-console/dist/setupTestFramework.js'
}
