// eslint-disable-next-line @typescript-eslint/no-var-requires
const { jsWithTs: tsjPreset } = require('ts-jest/presets')
const path = require('path')

module.exports = {
  testEnvironment: 'node',
  transform: {
    ...tsjPreset.transform
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
    'ts-jest': {
      diagnostics: false,
      tsConfig: {
        jsx: 'react',
        allowJs: true,
        target: 'ES6'
      }
    }
  },
  testPathIgnorePatterns: [
    'node_modules',
    'utils'
  ],
  moduleNameMapper: {
    '@tarojs/shared': path.resolve(__dirname, '..', '..', 'packages/shared/src/index.ts'),
    '@tarojs/react': path.resolve(__dirname, '..', '..', 'packages/taro-react/dist/index.js')
  },
  // setupFiles: ['<rootDir>/__tests__/setup.js'],
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)']
}
