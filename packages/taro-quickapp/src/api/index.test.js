describe('test', () => {
  const chalk = require('chalk')
  const api = require('./index')
  const unsupportedApi = require('./unsupportedApi')
  console.log(Object.keys(api).map(e => !unsupportedApi[e] ? e : chalk.red(e)).join(' '))

  test('api test', () => {})
})
