module.exports = {
  extends: [
    './rules/jsx',
    './rules/imports',
    './rules/variables'
  ].map(require.resolve).concat('plugin:taro/all'),
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true
    }
  }
}
