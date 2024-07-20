import type { Config } from 'jest'

const config: Config = {
  coveragePathIgnorePatterns: [
    '/__tests__/',
    '/src/(class-method-renamer|create-html-element|eslint|functional|jsx|lifecycle|plugins|render-props|render)\\.ts$',
  ],
  collectCoverageFrom: [
    'src/wxs.ts',
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  preset: 'ts-jest',
  snapshotSerializers: ['jest-taro-helper/lib/snapshot/serializers.js'],
  testEnvironment: 'node',
  testEnvironmentOptions: {},
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  testTimeout: 120000,
  testPathIgnorePatterns: [
    'node_modules',
    'utils',
  ],
  transform: {
    '^.+\\.m?[tj]sx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['jest-helper', 'node_modules'],
}

export default config
