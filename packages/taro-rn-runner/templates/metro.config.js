const { mergeConfig } = require('metro-config')
const { getMetroConfig } = require('@tarojs/rn-supporter')

module.exports = mergeConfig({
  // custom your metro config here
  // https://facebook.github.io/metro/docs/configuration
  resolver: {}
}, getMetroConfig({
  // whether to print the preview QR code
  qr: process.env.NODE_ENV !== 'production'
}))