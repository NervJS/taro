module.exports = {
  extends: ['standard', 'standard-jsx'],
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true
  },
  globals: {
    jd: true,
    wx: true,
    my: true,
    swan: true,
    tt: true,
    qq: true,
    getApp: true,
    __wxRoute: true,
    getCurrentPages: true,
    requirePlugin: true
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
