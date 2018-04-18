module.exports = {
  root: true,
  extends: ['standard', 'plugin:react/recommended', 'plugin:jest/recommended', 'plugin:flowtype/recommended'],
  plugins: ['flowtype'],
  parser: 'babel-eslint',
  env: {
    'node': true,
    'jest': true,
  },
  rules: {
    'comma-dangle': [2, 'only-multiline']
  }
}
