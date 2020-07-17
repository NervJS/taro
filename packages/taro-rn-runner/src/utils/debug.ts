import createDebug from 'debug'

const loaderDebug = createDebug('rn-runner:Loader')
const pluginDebug = createDebug('rn-runner:Plugin')
const assetsDebug = createDebug('rn-runner:Assets')

export {
  loaderDebug,
  pluginDebug,
  assetsDebug
}
