// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { jsWithTs: tsjPreset } = require('ts-jest/presets')
const path = require('path')
const fs = require('fs')
const config = JSON.parse(fs.readFileSync(`${__dirname}/.swcrc`, 'utf-8'))

module.exports = {
  testEnvironment: 'node',
  transform: {
    // ...tsjPreset.transform,
    // '^.+\\.(ts|tsx)$': ['@swc/jest']
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
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  moduleNameMapper: {
    '@tarojs/shared': path.join(__dirname, './packages/shared/src')
  }
}
