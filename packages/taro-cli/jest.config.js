module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  testEnvironment: 'node',
  testEnvironmentOptions: {},
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  testTimeout: 60000,
  transform: {
    '^.+\\.jsx?$': [require.resolve('babel-jest'), { rootMode: 'upward' }],
    '^.+\\.tsx?$': ['ts-jest', {
      diagnostics: false,
      tsconfig: {
        allowJs: true
      }
    }],
  },
  transformIgnorePatterns: [
    'node_modules',
  ],
}
