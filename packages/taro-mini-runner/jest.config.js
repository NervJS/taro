const fs = require('fs')

const config = JSON.parse(fs.readFileSync('../../.swcrc', 'utf-8'))

module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', {
      ...config
    }]
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],
  setupFilesAfterEnv: ['./src/__tests__/setup/index.ts'],
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  testTimeout: 30000
}
