import { resolve } from 'node:path'

import type { Config } from 'jest'

const config: Config = {
  collectCoverage: false,
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: [
    'node_modules',
  ],
  moduleNameMapper: {
    '@tarojs/plugin-platform-h5/dist/definition.json': resolve(__dirname, '..', 'taro-platform-h5/dist/definition.json')
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': ['ts-jest', {
      diagnostics: false,
      tsconfig: {
        allowJs: true
      }
    }],
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/']
}

export default config
