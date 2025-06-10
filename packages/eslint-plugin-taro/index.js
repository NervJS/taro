module.exports = {
  rules: {
    'max-ternary-depth': require('./rules/max-ternary-depth')
  },
  configs: {
    recommended: {
      rules: {
        'custom/max-ternary-depth': ['error', 2]
      }
    }
  }
}
