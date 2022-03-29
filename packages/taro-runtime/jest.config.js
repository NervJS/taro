// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { jsWithTs: tsjPreset } = require('ts-jest/presets')
const path = require('path')
const fs = require('fs')

const config = JSON.parse(fs.readFileSync('../../.swcrc', 'utf-8'))

module.exports = {
  testEnvironment: 'node',
  transform: {
    // ...tsjPreset.transform
    '^.+\\.(t|j)sx?$': ['@swc/jest', {
      ...config
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(lodash-es)/)'
  ],
  testURL: 'http://localhost/',
  collectCoverage: false,
  coveragePathIgnorePatterns: [
    'nerv.js',
    'vue.js',
    'utils.js'
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  globals: {
    ENABLE_INNER_HTML: true,
    ENABLE_ADJACENT_HTML: true,
    ENABLE_SIZE_APIS: true,
    ENABLE_TEMPLATE_CONTENT: true,
    ENABLE_MUTATION_OBSERVER: true,
    ENABLE_CLONE_NODE: true,
    ENABLE_CONTAINS: true,
    'ts-jest': {
      diagnostics: false,
      tsConfig: 'tsconfig.test.json'
    }
  },
  testPathIgnorePatterns: [
    'node_modules',
    'utils'
  ],
  moduleNameMapper: {
    '@tarojs/shared': path.resolve(__dirname, '..', '..', 'packages/shared/src/index.ts'),
    '@tarojs/react': path.resolve(__dirname, '..', '..', 'packages/taro-react/dist/index.js'),
    '@tarojs/plugin-framework-vue2': path.resolve(__dirname, '..', '..', 'packages/taro-plugin-vue2/dist/runtime.js')
  },
  // setupFiles: ['<rootDir>/__tests__/setup.js'],
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)']
}
