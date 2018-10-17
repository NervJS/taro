module.exports = {
  verbose: true,
  preset: 'react-native',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/mocks/']
}
