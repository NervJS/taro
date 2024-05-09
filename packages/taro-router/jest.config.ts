import type { Config } from 'jest'

const config: Config = {
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
  moduleNameMapper: {
    '@tarojs/taro': '@tarojs/taro-h5',
  },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'https://taro.aotu.io'
  },
  transform: {
    '^.+\\.m?[tj]sx?$': ['ts-jest', {
      diagnostics: false,
      tsconfig: {
        jsx: 'react',
        allowJs: true
      }
    }],
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/']
}

export default config
