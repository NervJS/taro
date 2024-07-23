// /** @type {import('jest').Config} */
/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'jest-preset-stylelint',
  runner: 'jest-light-runner',
  setupFiles: ['./jest.setup.js'],
  testMatch: ['**/src/**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.m?[tj]sx?$': ['ts-jest', {
      useESM: true,
      diagnostics: false,
      tsconfig: 'tsconfig.test.json'
    }],
  },
}
