import type { Config } from 'jest'

const config: Config = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup/index.ts'],
  snapshotSerializers: ['jest-taro-helper/lib/snapshot/serializers.js'],
  testEnvironment: 'node',
  testEnvironmentOptions: {},
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  testTimeout: 60000,
  transform: {
    '^.+\\.(css|sass|scss|less|styl|stylus|pcss|postcss)$': [
      'jest-transform-css',
      {
        module: true,
      },
    ],
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: false,
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules'],
}

export default config
