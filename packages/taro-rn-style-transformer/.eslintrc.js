const config = require('../../.eslintrc.js')

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    '@typescript-eslint/no-use-before-define': 0,
  }
}
