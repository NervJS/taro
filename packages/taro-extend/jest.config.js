const path = require('path')

module.exports = {
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    'nerv.js',
    'vue.js',
    'utils.js'
  ],
  globals: {
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
    '@tarojs/shared': path.resolve(__dirname, '..', '..', 'packages/shared/src/index.ts'),
    '@tarojs/runtime': path.resolve(__dirname, '..', '..', 'packages/taro-runtime/dist/runtime.esm.js')
  },
  preset: 'ts-jest',
  // setupFiles: ['<rootDir>/__tests__/setup.js'],
  testEnvironment: 'node',
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: [
    'node_modules',
    'utils'
  ],
  transform: {
    '^.+\\.m?[tj]sx?$': ['ts-jest', {
      diagnostics: false,
      tsconfig: {
        jsx: 'react',
        allowJs: true,
        esModuleInterop: true,
        target: 'ES6'
      }
    }],
  }
}
