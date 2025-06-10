module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/vue3-essential'
  ],
  parserOptions: {
    parser: require.resolve('@babel/eslint-parser')
  }
}
