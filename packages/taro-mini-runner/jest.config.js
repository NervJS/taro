module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],
  setupFilesAfterEnv: ['./__tests__/setup/index.ts'],
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  testTimeout: 30000
}
