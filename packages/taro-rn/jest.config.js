module.exports = {
  ...require('jest-expo/jest-preset'),
  verbose: true,
  preset: 'react-native',
  // projects: [{ preset: 'jest-expo/ios' }],
  transform: {
    '^.+\\.js$': '../../node_modules/react-native/jest/preprocessor.js', // 不是workspace模式下使用 <rootDir> 代替相对路径
    '^.+\\.tsx?$': 'ts-jest'
  },
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
