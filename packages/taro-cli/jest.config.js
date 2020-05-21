module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],
  testMatch: ['**/__tests__/inspect.spec.ts'],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }
}
