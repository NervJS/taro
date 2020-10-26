/* eslint-disable */
'use strict';

var _expo = require('expo');

var _expo2 = _interopRequireDefault(_expo);

var _App = require('../src/app');

var _App2 = _interopRequireDefault(_App);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactNative = require('react-native');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.env.NODE_ENV === 'development') {
  _expo2.default.KeepAwake.activate();
}

_expo2.default.registerRootComponent(_App2.default);
