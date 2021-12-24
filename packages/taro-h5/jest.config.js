const { jsWithTs: tsjPreset } = require('ts-jest/presets')

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testURL: 'http://localhost/',
  collectCoverage: false,
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  setupFiles: ['jest-localstorage-mock'],
  setupFilesAfterEnv: [
    'jest-mock-console/dist/setupTestFramework.js'
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
    ...tsjPreset.transform
  },
  globals: {
    window: true,
    ENABLE_INNER_HTML: true,
    ENABLE_ADJACENT_HTML: true,
    ENABLE_SIZE_APIS: true,
    ENABLE_TEMPLATE_CONTENT: true,
    ENABLE_MUTATION_OBSERVER: true,
    ENABLE_CLONE_NODE: true,
    'ts-jest': {
      diagnostics: false,
      tsconfig: {
        allowJs: true,
        target: 'ES6',
        jsx: 'react',
        jsxFactory: 'React.createElement'
      }
    }
  },
  moduleNameMapper: {
    react: 'nervjs',
    'react-dom': 'nervjs',
    '@tarojs/taro-h5': '<rootDir>/src/index.ts',
    '(\\.(css|less|sass|scss))|weui': '<rootDir>/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js'
  }
}
