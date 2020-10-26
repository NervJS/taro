module.exports = {
  verbose: true,
  preset: 'react-native',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: ['node_modules/(?!(react-native|react-navigation|react-navigation-stack|react-native-screens|react-native-safe-area-view|react-navigation-tabs)/)'],
  setupTestFrameworkScriptFile: 'jest-enzyme',
  testEnvironment: 'enzyme',
  testEnvironmentOptions: {
    enzymeAdapter: 'react16'
  }
}
