const { jsWithTs: tsjPreset } = require('ts-jest/presets')

module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsconfig: 'tsconfig.test.json'
    }
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./src/__tests__/setup/index.ts'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  testTimeout: 60000,
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
    ...tsjPreset.transform
  },
  transformIgnorePatterns: [
    'node_modules',
  ],
}
