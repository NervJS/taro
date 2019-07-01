module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testURL: 'https://taro.aotu.io',
  globals: {
    window: true
  },
  moduleNameMapper: {
    'nervjs': '<rootDir>/node_modules/nervjs'
  }
}
