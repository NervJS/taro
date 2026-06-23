module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['<rootDir>/__tests__/**/**.test.[jt]s?(x)'],
  transformIgnorePatterns: [
    'node_modules/(?!(.*(jest-)?@?react-native|.*@react-native(-community)?)|.*expo|.*@react-navigation/.*|.*react-native-svg)'
  ]
}
