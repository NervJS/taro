const config = require('../../.eslintrc.js')

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    '@typescript-eslint/ban-types': ['error', {
      types: {
        Function: false,
        Object: false
      }
    }],
  }
}
