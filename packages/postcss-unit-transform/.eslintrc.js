module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  parserOptions: { },
  extends: [
    'eslint:recommended',
    'standard',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-var-requires': 0
  }
}
