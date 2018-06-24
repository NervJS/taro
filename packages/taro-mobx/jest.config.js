module.exports = {
  verbose: true,
  moduleFileExtensions: ['js', 'jsx', 'json'],
  rootDir: __dirname,
  testMatch: ['<rootDir>/**/*.test.js'],
  transform: {
    '^.+\\.js?$': 'babel-jest'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleNameMapper: { '^inferno(.*?)$': '<rootDir>/packages/inferno$1/src', 'nerv-create-class': '<rootDir>/node_modules/nerv-create-class/dist/index.js' }
}
