// eslint-disable-next-line @typescript-eslint/no-var-requires
const { jsWithTs: tsjPreset } = require('ts-jest/presets')

module.exports = {
  testEnvironment: 'node',
  transform: {
    ...tsjPreset.transform
  },
  testURL: 'http://localhost/',
  collectCoverage: false,
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsconfig: 'tsconfig.test.json'
    }
  },
  testPathIgnorePatterns: [
    'node_modules',
    'utils'
  ],
  testMatch: ['**/__tests__/hooks.spec.ts']
  // testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)']
}
