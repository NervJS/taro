const { jsWithTs: tsjPreset } = require('ts-jest/presets')

module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  testTimeout: 60000,
  transform: {
    '^.+\\.jsx?$': [ require.resolve('babel-jest'), { rootMode: 'upward' } ],
    '^.+\\.tsx?$': 'ts-jest',
    ...tsjPreset.transform
  },
  transformIgnorePatterns: [
    'node_modules',
  ],
}
