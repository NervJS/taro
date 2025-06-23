const config = require('../../.eslintrc.js')

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'no-console': 0,
    camelcase: 0,
    'react/react-in-jsx-scope': 'off'
  }
}
