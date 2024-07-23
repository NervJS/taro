const config = require('../../.eslintrc.js')

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'no-use-before-define': 0,
    '@typescript-eslint/ban-types': ['error', {
      types: {
        Function: false,
        Object: false
      }
    }],
  }
}
