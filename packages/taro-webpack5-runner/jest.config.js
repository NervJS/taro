module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    '@pmmmwh/react-refresh-webpack-plugin': '<rootDir>/src/__tests__/mocks/react-refresh',
    '@prefresh/webpack': '<rootDir>/src/__tests__/mocks/react-refresh'
  },
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./src/__tests__/setup/index.ts'],
  testEnvironment: 'node',
  testEnvironmentOptions: {},
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  testTimeout: 120000,
  transform: {
    '^.+\\.(css|sass|scss|less|styl|stylus|pcss|postcss)$': ['jest-transform-css', {
      module: true
    }],
    '^.+\\.m?[tj]sx?$': ['ts-jest', {
      diagnostics: false,
      tsconfig: 'tsconfig.test.json'
    }],
  },
  transformIgnorePatterns: [
    'node_modules',
  ],
}
