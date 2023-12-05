const config = require('../../.eslintrc.js')

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    '@typescript-eslint/no-unused-vars': 0,
  }
}
