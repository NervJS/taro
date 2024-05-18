module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  preset: 'jest-preset-stylelint',
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: [
    'lib/**/*.js'
  ],
  coverageDirectory: './.coverage/',
  coverageReporters: [
    'lcov',
    'text'
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75
    }
  },
  setupFiles: ['./jest.setup.js'],
  testEnvironment: 'node',
  testMatch: ['**/src/**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['node_modules'],
  transform: {
    '^.+\\.m?[tj]sx?$': ['ts-jest', {
      diagnostics: false,
      tsconfig: 'tsconfig.test.json'
    }],
  },
}
