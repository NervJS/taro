module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/__tests__/**/*.spec.tsx'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        target: 'ES2020',
        module: 'CommonJS',
        jsx: 'react-jsx',
        esModuleInterop: true,
        isolatedModules: true
      }
    }]
  }
}
