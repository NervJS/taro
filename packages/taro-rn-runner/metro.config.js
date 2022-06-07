/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 */

// 依赖的模块路径，需要在watchFolders中声明, 详见 metro-resolver
module.exports = {
  resetCache: true,
  projectRoot: __dirname,
  watchFolders: [
    './',
    '../../',
    '../../node_modules'
  ]
}
