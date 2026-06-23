module.exports = {
  preset: 'jest-expo',
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/src/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(.*(jest-)?@?react-native|.*@react-native(-community)?)|.*expo|.*@react-navigation/.*|.*react-native-svg)'
  ]
}
