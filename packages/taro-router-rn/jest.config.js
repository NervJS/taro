const { jsWithTs: tsjPreset } = require('ts-jest/presets')

module.exports = {
  verbose: true,
  preset: 'react-native',
  transform: {
    ...tsjPreset.transform
  },
  collectCoverage: true,
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js'
  ],
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsConfig: {
        jsx: 'react',
        allowJs: true,
        target: 'ES6'
      }
    }
  },
  testPathIgnorePatterns: [
    'node_modules',
    'utils'
  ],
  setupTestFrameworkScriptFile: 'jest-enzyme',
  testEnvironment: 'enzyme',
  testEnvironmentOptions: {
    enzymeAdapter: 'react16'
  },
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)']
}
