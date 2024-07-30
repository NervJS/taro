const config = require('../../.eslintrc.js')

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'no-console': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/ban-types': ['error', {
      types: {
        Function: false,
        Object: false
      }
    }],
  }
}
