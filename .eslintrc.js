module.exports = {
  'parser': '@typescript-eslint/parser',
  'plugins': ['@typescript-eslint', 'jest', 'react'],
  'extends': [
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended'
  ],
  'rules': {
    'no-unused-vars': 'off',
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'args': 'after-used', }],
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/no-namespace': 0,
    'standard/no-callback-literal': 0,
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'prefer-spread': 0,
    'prefer-rest-params': 0,
    'no-prototype-builtins': 0,
    'react/jsx-uses-vars': 'warn',
    'react/prop-types': 0,
    'react/no-find-dom-node': 0,
    'no-unused-expressions': 0
    // 'camelcase': ['error', {allow: ['^internal_', '^unstable_']}]
  },
  'env': {
    'jest/globals': true,
    'browser': true,
    'node': true,
    'es6': true,
  },
  'globals': {
    'testRule': 'readonly',
    'wx': 'readonly',
    'qq': 'readonly',
    'tt': 'readonly',
    'swan': 'readonly',
    'my': 'readonly',
    'getCurrentPages': 'readonly',
    'getApp': 'readonly',
    'requirePlugin': 'readonly',
    'jd': 'readonly',
    'LOCATION_APIKEY': 'readonly'
  },
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    }
  }
}
