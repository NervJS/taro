module.exports = {
  ...require('jest-expo/jest-preset'),
  verbose: true,
  preset: 'react-native',
  transform: {
    '^.+\\.js$': '../../node_modules/react-native/jest/preprocessor.js', // 不是workspace模式下使用 <rootDir> 代替相对路径
    '^.+\\.tsx?$': 'ts-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@bang88/react-native-ultimate-listview|react-native-.*|expo-.*|@expo/.*|@unimodules/.*|unimodules-.*|@react-native-community/.*)/)'
  ],
  testMatch: [
    '**/__tests__/**/*.spec.ts?(x)',
    '**/?(*.)+(spec|test).ts?(x)'
  ],
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
    '/node_modules/',
    './setupTests.js'
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
  },
  setupFilesAfterEnv: ['./setup.js']
}
