const config = require('../../.eslintrc.js')

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'no-empty': 0,
    'react/display-name': 0,
  }
}
