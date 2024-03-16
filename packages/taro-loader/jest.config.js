module.exports = {
  collectCoverage: false,
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: [
    'node_modules',
    'utils'
  ],
  transform: {
    '^.+\\.m?[tj]sx?$': ['ts-jest', {
      diagnostics: false,
      tsconfig: {
        jsx: 'react',
        allowJs: true
      }
    }],
  },
  transformIgnorePatterns: ['node_modules']
}
