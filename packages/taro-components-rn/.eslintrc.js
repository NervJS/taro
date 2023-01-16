module.exports = {
  root: true,
  extends: [
    'standard',
    'plugin:react/recommended',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
    jest: true,
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'comma-dangle': [2, 'only-multiline'],
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    'space-before-function-paren': 0,
    'react/display-name': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-use-before-define': 2,
    'no-use-before-define': 0,
    'no-unused-expressions': 0
  }
}
