import initNativeApi from './native-api'

function createApp (AppClass) {
  initNativeApi(this)
  const app = new AppClass()
  const weappAppConf = {
    onLaunch (options) {
      app.$app = this
      app.$router = {
        params: options
      }
      if (app.componentWillMount) {
        app.componentWillMount()
      }
      if (app.componentDidMount) {
        app.componentDidMount()
      }
    },

    onShow (options) {
      Object.assign(app.$router.params, options)
      if (app.componentDidShow) {
        app.componentDidShow()
      }
    },

    onHide () {
      if (app.componentDidHide) {
        app.componentDidHide()
      }
    },

    onError () {
      if (app.componentDidCatchError) {
        app.componentDidCatchError()
      }
    },

    onPageNotFound () {
      if (app.componentDidNotFound) {
        app.componentDidNotFound()
      }
    }
  }
  return Object.assign(weappAppConf, app)
}

export default createApp
