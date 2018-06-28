module.exports = {
  verbose: true,
  preset: 'jest-react-native',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@nart/react-native-swiper|react-native-vertical-view-pager)/)'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    './setupTests.js'
  ],
  // moduleFileExtensions: [
  //   'js',
  //   'ios.js',
  //   'android.js'
  // ],
  setupTestFrameworkScriptFile: './setupTests.js'
}
