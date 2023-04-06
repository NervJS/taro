const path = require('path')

module.exports = {
  collectCoverage: false,
  globals: {
    window: true,
    ENABLE_INNER_HTML: true,
    ENABLE_ADJACENT_HTML: true,
    ENABLE_SIZE_APIS: true,
    ENABLE_TEMPLATE_CONTENT: true,
    ENABLE_MUTATION_OBSERVER: true,
    ENABLE_CLONE_NODE: true,
    ENABLE_CONTAINS: true,
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    '@tarojs/taro-h5': path.resolve(__dirname, '..', '..', 'packages/taro-h5/src/index.ts'),
    '@tarojs/shared': path.resolve(__dirname, '..', '..', 'packages/shared/src/index.ts'),
    '@tarojs/plugin-framework-react/dist/runtime': path.resolve(__dirname, '..', '..', 'packages/taro-h5/__mocks__/taro-framework'),
    '@tarojs/plugin-framework-vue2/dist/runtime': path.resolve(__dirname, '..', '..', 'packages/taro-h5/__mocks__/taro-framework'),
    '@tarojs/plugin-framework-vue3/dist/runtime': path.resolve(__dirname, '..', '..', 'packages/taro-h5/__mocks__/taro-framework'),
    '(\\.(css|less|sass|scss))|weui': path.resolve(__dirname, '..', '..', 'packages/taro-h5/__mocks__/styleMock.js'),
    '\\.(gif|ttf|eot|svg)$': path.resolve(__dirname, '..', '..', 'packages/taro-h5/__mocks__/fileMock.js')
  },
  preset: 'ts-jest',
  setupFiles: [path.resolve(__dirname, '..', '..', 'packages/taro-h5/__mocks__/setEnv.ts')],
  setupFilesAfterEnv: [
    'jest-mock-console/dist/setupTestFramework.js'
  ],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: [
    'node_modules',
    'utils'
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': ['ts-jest', {
      diagnostics: false,
      tsconfig: {
        jsx: 'react',
        allowJs: true
      }
    }],
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/']
}
