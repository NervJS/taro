const config = require('../../.eslintrc.js')

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'default-param-last': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          object: false,
          Function: false
        }
      }
    ]
  }
}
