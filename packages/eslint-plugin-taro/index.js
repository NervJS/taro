const rules = [
  './rules/jsx',
  './rules/imports',
  './rules/es6'
  // './rules/custom'
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
