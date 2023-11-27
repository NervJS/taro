import type { Config } from 'jest'

const config: Config = {
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    '^globby$': '<rootDir>/src/__tests__/bundled/globby/index.js',
    '@pmmmwh/react-refresh-webpack-plugin': '<rootDir>/src/__tests__/mocks/react-refresh',
    '@prefresh/webpack': '<rootDir>/src/__tests__/mocks/react-refresh',
  },
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup/index.ts'],
  snapshotSerializers: ['jest-taro-helper/lib/snapshot/serializers.js'],
  testEnvironment: 'node',
  testEnvironmentOptions: {},
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  testTimeout: 120000,
  transform: {
    '^.+\\.(css|sass|scss|less|styl|stylus|pcss|postcss)$': [
      'jest-transform-css',
      {
        module: true,
      },
    ],
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      {
        diagnostics: false,
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  transformIgnorePatterns: ['^(?=.*node_modules)(?!.*copy-webpack-plugin).*'],
  globalSetup: '<rootDir>/globalSetup.js',
}

export default config
