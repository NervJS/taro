const path = require('path')
const blacklist = require('metro').createBlacklist

module.exports = {
  extraNodeModules: {
    react: path.resolve(__dirname, 'node_modules/react'),
    'react-native': path.resolve(__dirname, 'node_modules/react-native')
  },
  getBlacklistRE () {
    return blacklist([
      /TCRNExample\/node_modules\/react-native\/.*/
    ])
  },
  getProjectRoots () {
    return [
      path.resolve(__dirname),
      path.resolve(__dirname, '../dist'),
      path.resolve(__dirname, '../node_modules')
    ]
  }
}
