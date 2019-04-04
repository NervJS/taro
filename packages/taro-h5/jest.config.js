module.exports = {
  testMatch: ['<rootDir>/__test__/**/*-test.js'],
  setupFiles: ['jest-localstorage-mock'],
  setupFilesAfterEnv: [
    'jest-mock-console/dist/setupTestFramework.js'
  ],
  transform: {
    ".js": "babel-jest",
  },
}
