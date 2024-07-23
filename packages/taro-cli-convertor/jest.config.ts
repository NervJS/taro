import type { Config } from 'jest'

const config: Config = {
  coveragePathIgnorePatterns: ['/__tests__/'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testEnvironmentOptions: {},
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  testTimeout: 60000,
  transform: {
    '^.+\\.m?tsx?$': ['ts-jest', {
      diagnostics: false,
      tsconfig: {
        allowJs: true,
      }
    }],
  },
  transformIgnorePatterns: [
    'node_modules',
  ],
}

export default config
