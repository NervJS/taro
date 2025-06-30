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
  testEnvironment: 'node',
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: [
    'node_modules',
  ],
  transform: {
    '^.+\\.m?[tj]sx?$': ['ts-jest', {
      diagnostics: false,
      tsconfig: 'tsconfig.test.json'
    }],
  }
}
