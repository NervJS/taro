const rules = [
  './rules/jsx',
  './rules/imports',
  './rules/custom'
].map(require.resolve)

rules.unshift('standard')

module.exports = {
  extends: rules,
  parserOptions: {
    ecmaVersion: 2017,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    }
  }
}
