const fs = require('fs')

const config = JSON.parse(fs.readFileSync('../../.swcrc', 'utf-8'))

module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', {
      ...config
    }]
  },
  // preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)']
  // globals: {
  //   'ts-jest': {
  //     diagnostics: false
  //   }
  // }
}
