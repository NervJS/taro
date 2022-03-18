module.exports = {
  preset: 'jest-expo',
  verbose: true,
  setupFilesAfterEnv: ['./src/setup.ts'],
  testMatch: ['<rootDir>/src/__tests__/**/**.test.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ]
}
