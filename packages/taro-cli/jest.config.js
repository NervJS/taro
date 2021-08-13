module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }
}
