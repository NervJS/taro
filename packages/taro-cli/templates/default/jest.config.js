<% if (['react', 'preact'].includes(framework)) {%>const defineJestConfig = require('@tarojs/test-utils-react/dist/jest.js').default<%}%><% if (framework === 'vue3') {%>const defineJestConfig = require('@tarojs/test-utils-vue3/dist/jest.js').default<%}%><% if (framework === 'vue') {%>const defineJestConfig = require('@tarojs/test-utils-vue/dist/jest.js').default<%}%>

module.exports = defineJestConfig({
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/__tests__/?(*.)+(spec|test).[jt]s?(x)']
})
