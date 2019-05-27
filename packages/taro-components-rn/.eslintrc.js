module.exports = {
  root: true,
  extends: [
    'standard',
    'plugin:react/recommended',
    'plugin:jest/recommended',
    // 'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    'node': true,
    'jest': true,
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'comma-dangle': [2, 'only-multiline']
  }
}
