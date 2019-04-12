const path = require('path')

module.exports = {
  extraNodeModules: {
    react: path.resolve(__dirname, 'node_modules/react'),
    'react-native': path.resolve(__dirname, 'node_modules/react-native')
  },
  getProjectRoots () {
    return [
      path.resolve(__dirname),
      path.resolve(__dirname, '../dist'),
      path.resolve(__dirname, '../node_modules')
    ]
  }
}
