const path = require('path')

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testURL: 'https://taro.aotu.io',
  globals: {
    window: true
  },
  moduleNameMapper: {
    'nervjs': path.join(__dirname, 'node_modules', 'nervjs')
    // 'nervjs': require.resolve('nervjs')
  }
};