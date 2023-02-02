const { jsWithTs: tsjPreset } = require('ts-jest/presets')
const path = require('path')

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testURL: 'http://localhost/',
  collectCoverage: false,
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  setupFiles: ['jest-localstorage-mock', '<rootDir>/__mocks__/setEnv.ts'],
  setupFilesAfterEnv: [
    'jest-mock-console/dist/setupTestFramework.js'
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
    ...tsjPreset.transform
  },
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: [
    'node_modules',
    'utils'
  ],
  globals: {
    window: true,
    ENABLE_INNER_HTML: true,
    ENABLE_ADJACENT_HTML: true,
    ENABLE_SIZE_APIS: true,
    ENABLE_TEMPLATE_CONTENT: true,
    ENABLE_MUTATION_OBSERVER: true,
    ENABLE_CLONE_NODE: true,
    ENABLE_CONTAINS: true,
    'ts-jest': {
      diagnostics: false,
      isolatedModules: true,
      tsconfig: {
        jsx: 'react',
        allowJs: true
      }
    }
  },
  moduleNameMapper: {
    '@tarojs/taro': '@tarojs/taro-h5',
    '@tarojs/taro-h5': '<rootDir>/src/index.ts',
    '@tarojs/shared': path.resolve(__dirname, '..', '..', 'packages/shared/src/index.ts'),
    '@tarojs/plugin-framework-react/dist/runtime': '<rootDir>/__mocks__/taro-framework',
    '@tarojs/plugin-framework-vue2/dist/runtime': '<rootDir>/__mocks__/taro-framework',
    '@tarojs/plugin-framework-vue3/dist/runtime': '<rootDir>/__mocks__/taro-framework',
    '(\\.(css|less|sass|scss))|weui': '<rootDir>/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js'
  }
}
