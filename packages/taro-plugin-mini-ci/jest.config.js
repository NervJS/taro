module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'ts', 'json', 'node'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      diagnostics: false
    }],
  },
}
