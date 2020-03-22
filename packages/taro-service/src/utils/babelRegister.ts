export default function createBabelRegister ({ appPath, only, babelConfig }) {
  require('babel-register')({
    only: Array.from(new Set([...only])),
    presets: [require.resolve('babel-preset-env', { paths: [appPath] })],
    plugins: processBabelPluginsConfig(babelConfig.plugins, appPath),
    extensions: ['.jsx', '.js', '.ts', '.tsx'],
    babelrc: false,
    cache: false
  })
}

function setBabelPluginPrefixer (name, appPath) {
  if (!/^babel-plugin/.test(name)) {
    return require.resolve(`babel-plugin-${name}`, { paths: [appPath] })
  }
  return require.resolve(name, { paths: [appPath] })
}

function processBabelPluginsConfig (plugins, appPath) {
  return plugins.concat().map(plugin => {
    if (typeof plugin === 'string') {
      return setBabelPluginPrefixer(plugin, appPath)
    }
    return plugin.map(item => {
      if (typeof item === 'string') {
        return setBabelPluginPrefixer(item, appPath)
      }
    })
  })
}