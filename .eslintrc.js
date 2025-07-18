module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'import',
    'jest',
    'react',
    'simple-import-sort',
    'taro',
  ],
  extends: [
    'eslint:recommended',
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react/recommended'
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/indent': [2, 2],
    '@typescript-eslint/member-delimiter-style': [
      1,
      { multiline: { delimiter: 'none' }, singleline: { delimiter: 'comma' } },
    ],
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-namespace': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-this-alias': 0,
    '@typescript-eslint/no-unused-vars': [2, { argsIgnorePattern: '^_', args: 'after-used' }],
    '@typescript-eslint/no-use-before-define': [1, { functions: false, classes: false }],
    '@typescript-eslint/no-var-requires': 0,
    camelcase: 0,
    'comma-dangle': 0,
    'comma-spacing': 2,
    complexity: [2, 50],
    'eol-last': 2,
    'max-depth': [2, 10],
    'no-console': [2, { allow: ['warn', 'error'] }],
    'no-empty': 1,
    'no-multi-spaces': 2,
    'no-multiple-empty-lines': 0,
    'no-mixed-operators': 0,
    'no-prototype-builtins': 0,
    'no-unused-expressions': 0,
    'no-unused-vars': 'off',
    'no-use-before-define': 0,
    'import/first': 2,
    'import/newline-after-import': 2,
    'import/no-duplicates': 2,
    'import/no-named-default': 'off',
    indent: 0,
    'keyword-spacing': 2,
    'object-curly-spacing': 2,
    'operator-linebreak': [2, 'after', {
      overrides: { '?': 'before', ':': 'before' },
    }],
    'prefer-spread': 0,
    'prefer-rest-params': 0,
    'react/jsx-uses-vars': 1,
    'react/prop-types': 0,
    'react/no-find-dom-node': 0,
    'react/no-unknown-property': 0,
    quotes: [2, 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    semi: [2, 'never'],
    'simple-import-sort/imports': [
      2,
      {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          // Node.js builtins prefixed with `node:`.
          ['^node:'],
          // Packages.
          // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
          ['^@?\\w'],
          // Absolute imports and other imports such as Vue-style `@/foo`.
          // Anything not matched in another group.
          ['^'],
          // Relative imports.
          // Anything that starts with a dot.
          ['^\\.'],
          // Types Group
          ['^node:.*\\u0000$', '^@?\\w.*\\u0000$', '(?<=\\u0000)$', '^\\..*\\u0000$'],
        ],
      },
    ],
    'simple-import-sort/exports': 2,
    'space-before-function-paren': 0,
    'standard/no-callback-literal': 0,
    'taro/max-ternary-depth': [2, 3],
  },
  env: {
    'jest/globals': true,
    browser: true,
    node: true,
    es6: true,
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
    LOCATION_APIKEY: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
