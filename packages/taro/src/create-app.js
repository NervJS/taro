import initNativeApi from './native-api'

function createApp (appClass) {
  initNativeApi(this)
  const app = new appClass()
  const weappAppConf = {
    onLaunch (options) {
      if (app.componentDidMount) {
        app.componentDidMount(options)
      }
    }
  }
  return Object.assign(weappAppConf, app)
}

export default createApp
