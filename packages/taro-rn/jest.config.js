module.exports = {
  verbose: true,
  preset: 'jest-react-native',
  rootDir: __dirname,
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: ['<rootDir>/src/__tests__/**/*.test.js'],
  transformIgnorePatterns: ['node_modules/(?!(react-native|static-container|react-native-root-siblings|react-native-image-zoom-viewer|react-native-image-pan-zoom|react-native-root-toast)/)']
}
