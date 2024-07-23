export default {
  preset: 'jest-preset-stylelint',
  runner: 'jest-light-runner',
  setupFiles: ['./jest.setup.js'],
  testMatch: ['**/src/**/__tests__/?(*.)+(spec|test).js'],
}
