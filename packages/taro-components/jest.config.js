const { jsWithTs: tsjPreset } = require('ts-jest/presets')

module.exports = {
  preset: '@stencil/core/testing',
  moduleFileExtensions: ['js', 'jsx', 'json'],
  rootDir: __dirname,
  transform: {
    ...tsjPreset.transform
  },
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsConfig: {
        jsx: 'react',
        allowJs: true,
        target: 'ES6',
        jsxFactory: 'React.createElement'
      }
    }
  },
  // globalSetup: '<rootDir>/__tests__/setup.js',
  testRegex: '(/__tests__/.*|(\\.|/)(tt|spec))\\.[jt]sx?$',
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleNameMapper: {
    react: 'nervjs',
    'react-addons-test-utils': 'nerv-test-utils',
    'react-dom': 'nervjs',
    '.scss$': '<rootDir>/__mock__/styleMock.js'
  },
  // testEnvironment: 'jsdom',
  testURL: 'http://localhost'
}
