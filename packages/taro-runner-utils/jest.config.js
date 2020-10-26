module.exports = {
  verbose: true,
  moduleFileExtensions: ['js', 'jsx', 'json'],
  rootDir: __dirname,
  testMatch: ['<rootDir>/__tests__/**/*.test.js'],
  transform: {
    '^.+\\.js?$': 'babel-jest'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/']
}
