const path = require('path')

module.exports = {
  collectCoverage: false,
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
    ENABLE_COOKIE: true,
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    '@tarojs/shared': path.resolve(__dirname, '..', '..', 'packages/shared/src/index.ts')
  },
  preset: 'ts-jest',
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
  transformIgnorePatterns: [
    'node_modules/(?!(lodash-es)/)'
  ]
}
