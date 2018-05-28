const { allRules, activeRules } = require('./rules/custom')

module.exports = {
  rules: allRules,
  configs: {
    plugins: [
      'taro'
    ],
    parserOptions: {
      ecmaVersion: 2018,
      ecmaFeatures: {
        jsx: true
      }
    },
    rules: activeRules
  }
}
