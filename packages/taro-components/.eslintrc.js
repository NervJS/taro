module.exports = {
    extends: ['standard', 'standard-jsx'],
    env: {
      browser: true,
      node: true,
      es6: true,
      jest: true,
    },
    globals: {
      wx: true,
      getApp: true,
      getCurrentPages: true
    },
    rules: {
      'no-unused-expressions': 0,
      'no-useless-constructor': 0
    },
    settings: {
      react: {
        pragma: 'Nerv'
      }
    },
    parser: 'babel-eslint'
  }
  