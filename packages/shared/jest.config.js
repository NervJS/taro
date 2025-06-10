module.exports = {
  collectCoverage: false,
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  testPathIgnorePatterns: [
    'node_modules',
    'utils'
  ],
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.m?[tj]sx?$': ['ts-jest', {
      diagnostics: false,
      tsconfig: 'tsconfig.test.json'
    }],
  }
}
