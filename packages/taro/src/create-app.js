import initNativeApi from './native-api'

function createApp (AppClass) {
  initNativeApi(this)
  const app = new AppClass()
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
