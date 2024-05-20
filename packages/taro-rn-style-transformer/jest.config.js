/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '/__tests__/.*.spec.[tj]sx?$',
  transform: {
    '^.+\\.m?[tj]sx?$': ['ts-jest', {
      useESM: true,
      babelConfig: 'babel.config.js',
      diagnostics: true,
      tsconfig: 'tsconfig.test.json'
    }],
  },
}
