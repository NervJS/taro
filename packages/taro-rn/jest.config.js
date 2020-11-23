
module.exports = {
  ...require('jest-expo/jest-preset'),
  verbose: true,
  preset: 'react-native',
  modulePathIgnorePatterns: [
    '<rootDir>/TCRNExample'
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: ['<rootDir>/src/__tests__/**/*.test.js'],
  transformIgnorePatterns: ['node_modules/(?!(react-native|static-container|react-native-.*|expo-.*|@expo/.*|@unimodules/.*|unimodules-.*|@react-native-community/.*)/)'],
  setupFilesAfterEnv: ['./setup.js'],
  testEnvironment: 'enzyme',
  testEnvironmentOptions: {
    enzymeAdapter: 'react16'
  }
}
