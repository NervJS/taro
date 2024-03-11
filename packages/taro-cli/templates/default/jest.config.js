{{#if (includes "React" "Preact" s=framework)}}const defineJestConfig = require('@tarojs/test-utils-react/dist/jest.js').default{{/if}}{{#if (eq framework "Vue3") }}const defineJestConfig = require('@tarojs/test-utils-vue3/dist/jest.js').default{{/if}}{{#if (eq framework "Vue") }}const defineJestConfig = require('@tarojs/test-utils-vue/dist/jest.js').default{{/if}}

module.exports = defineJestConfig({
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/__tests__/**/*.(spec|test).[jt]s?(x)']
})
