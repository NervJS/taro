module.exports = {
  collectCoverage: false,
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: [
    'node_modules',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': ['ts-jest', {
      diagnostics: false,
      tsconfig: {
        allowJs: true
      }
    }],
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/']
}
