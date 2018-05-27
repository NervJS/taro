const rules = [
  './rules/jsx',
  './rules/imports',
  './rules/variables',
  './rules/custom'
].map(require.resolve)

module.exports = {
  extends: rules,
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true
    }
  }
}
