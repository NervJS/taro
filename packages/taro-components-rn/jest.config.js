module.exports = {
  preset: 'jest-expo',
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/src/setup.ts'],
  transform: {
    '^.+\\.js$': '<rootDir>/../../node_modules/react-native/jest/preprocessor.js',
    '^.+\\.tsx?$': 'ts-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ]
}
