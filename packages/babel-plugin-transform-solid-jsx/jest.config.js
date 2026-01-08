module.exports = {
  moduleDirectories: ['node_modules', 'packages'],
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['./index.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
}
