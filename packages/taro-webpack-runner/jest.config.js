module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],
  moduleNameMapper: {
    '@pmmmwh/react-refresh-webpack-plugin': '<rootDir>/src/__tests__/mocks/react-refresh',
    '@prefresh/webpack': '<rootDir>/src/__tests__/mocks/react-refresh'
  },
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./src/__tests__/setup/index.ts'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  testTimeout: 60000
}
