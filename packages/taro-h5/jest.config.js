module.exports = {
  testMatch: ['<rootDir>/__test__/**/*-test.js'],
  setupFiles: ['jest-localstorage-mock'],
  setupFilesAfterEnv: [
    'jest-mock-console/dist/setupTestFramework.js'
  ],
  transform: {
    ".js": "babel-jest",
  },
  moduleNameMapper: {
    "@tarojs/taro-h5": "<rootDir>/src/index.js",
    "(\\.(css|less|sass|scss))|weui": "<rootDir>/__mocks__/styleMock.js",
    "\\.(gif|ttf|eot|svg)$": "<rootDir>/__mocks__/fileMock.js"
  }
}
