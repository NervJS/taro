module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testEnvironmentOptions: {},
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  setupFilesAfterEnv: ['./src/__tests__/setup/index.ts'],
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  testTimeout: 30000
}
