/** eslint-disable */
const Expo = require('expo')
const App = require('../../../../App')
const React, { Component } = require('react')
const { View } = require('react-native')

if (process.env.NODE_ENV === 'development') {
  Expo.KeepAwake.activate();
}

Expo.registerRootComponent(App)
