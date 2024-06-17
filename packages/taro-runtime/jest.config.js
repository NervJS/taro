const path = require('path')

module.exports = {
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
  preset: 'ts-jest',
  moduleNameMapper: {
    '@tarojs/plugin-framework-vue3/dist/runtime': path.resolve(__dirname, '..', '..', 'packages/taro-framework-vue3/dist/runtime'),
    '@tarojs/react': path.resolve(__dirname, '..', '..', 'packages/taro-react/dist/react.esm.js'),
  },
  setupFiles: [path.resolve(__dirname, './src/__tests__/setup.js')],
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
      tsconfig: 'tsconfig.test.json'
    }],
  },
  transformIgnorePatterns: ['node_modules/(?!(lodash-es)/)']
}
