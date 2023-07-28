const { mergeConfig } = require('metro-config')
const { getMetroConfig } = require('@tarojs/rn-supporter')

module.exports = (async function (){
  return mergeConfig({
  // custom your metro config here
  // https://facebook.github.io/metro/docs/configuration
    resolver: {}
  }, await getMetroConfig())
})()