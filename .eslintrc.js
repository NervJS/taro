module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest', 'react', 'simple-import-sort', 'import'],
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended'
  ],
  rules: {
    // 'camelcase': ['error', {allow: ['^internal_', '^unstable_']}]
    camelcase: 0,
    indent: 'off',
    '@typescript-eslint/no-this-alias': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/member-delimiter-style': ['warn', { multiline: { delimiter: 'none' }, singleline: { delimiter: 'comma' } }],
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', args: 'after-used' }],
    '@typescript-eslint/no-use-before-define': ['warn', { functions: false, classes: false }],
    '@typescript-eslint/no-namespace': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-var-requires': 0,
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-prototype-builtins': 0,
    'no-unused-expressions': 0,
    'no-unused-vars': 'off',
    'no-use-before-define': 0,
    'prefer-spread': 0,
    'prefer-rest-params': 0,
    'react/jsx-uses-vars': 'warn',
    'react/prop-types': 0,
    'react/no-find-dom-node': 0,
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'standard/no-callback-literal': 0
  },
  env: {
    'jest/globals': true,
    browser: true,
    node: true,
    es6: true
  },
  globals: {
    testRule: 'readonly',
    wx: 'readonly',
    qq: 'readonly',
    tt: 'readonly',
    swan: 'readonly',
    my: 'readonly',
    getCurrentPages: 'readonly',
    getApp: 'readonly',
    requirePlugin: 'readonly',
    jd: 'readonly',
    ks: 'readonly',
    LOCATION_APIKEY: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  }
}
