module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/recommended'
  ],
  parserOptions: {
    parser: require.resolve('@babel/eslint-parser')
  }
}
