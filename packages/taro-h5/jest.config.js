module.exports = {
  testMatch: ['<rootDir>/src/__test__/**/*-test.js'],
  setupFiles: ['jest-localstorage-mock'],
  setupTestFrameworkScriptFile: 'jest-mock-console/dist/setupTestFramework.js'
  // preset: 'jest-puppeteer',
  // testEnvironment: './custom-environment.js'
}
