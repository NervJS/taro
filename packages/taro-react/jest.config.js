// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { jsWithTs: tsjPreset } = require('ts-jest/presets')
const fs = require('fs')

const config = JSON.parse(fs.readFileSync('../../.swcrc', 'utf-8'))

module.exports = {
  testEnvironment: 'node',
  transform: {
    // ...tsjPreset.transform
    '^.+\\.(t|j)sx?$': ['@swc/jest', {
      ...config
    }]
  },
  testURL: 'http://localhost/',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  globals: {
    ENABLE_INNER_HTML: true,
    ENABLE_ADJACENT_HTML: true,
    ENABLE_SIZE_APIS: true,
    ENABLE_TEMPLATE_CONTENT: true,
    ENABLE_MUTATION_OBSERVER: true,
    ENABLE_CLONE_NODE: true,
    ENABLE_CONTAINS: true,
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
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)']
}
