const defineJestConfig = require('@tarojs/test-utils-vue3/dist/jest.js').default

module.exports = defineJestConfig({
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/__tests__/**/*.(spec|test).[jt]s?(x)']
})
