module.exports = {
  collectCoverage: false,
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  testEnvironment: 'node',
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  testMatch: ['**/__tests__/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: [
    'node_modules',
    'utils'
  ],
  // 对齐 taro-cli：显式 transform 而非 preset:'ts-jest'。
  // preset 会注入自己的 transform,与自定义 transform 合并时导致 .js 文件的 transform 失效
  // (fallback 到默认 babel-jest 无 TS/import 处理 → "Cannot use import statement outside a module")。
  transform: {
    '^.+\\.jsx?$': [require.resolve('babel-jest'), { rootMode: 'upward' }],
    '^.+\\.tsx?$': ['ts-jest', {
      diagnostics: false,
      tsconfig: {
        jsx: 'react',
        allowJs: true
      }
    }],
  },
  transformIgnorePatterns: ['node_modules']
}
