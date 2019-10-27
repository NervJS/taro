module.exports = {
  verbose: true,
  moduleNameMapper: {
    '@tarojs/taro-quickapp': '<rootDir>/src/index.js',
    // '@tarojs/taro': '<rootDir>/../taro/src/index',
    '@tarojs/utils': '<rootDir>/../taro-utils/src/index',
    '^@system.(.*)': '<rootDir>/__mocks__/@system/$1.js'
  },
  rootDir: __dirname,
  testMatch: ['<rootDir>/**/*.test.js'],
  transform: {
    '^.+\\.js?$': 'babel-jest'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/']
}
