import appGlobal from './global'

function createApp (AppClass) {
  const app = new AppClass()
  const appConf = {
    onCreate (options) {
      appGlobal.$app = this
      app.$app = this
      app.$app.$router = app.$router = {
        params: options
      }
      if (app.componentWillMount) {
        app.componentWillMount()
      }
      if (app.componentDidMount) {
        app.componentDidMount()
      }
    },

    onDestroy () {
      if (app.componentWillUnmount) {
        app.componentWillUnmount()
      }
    }
  }
  return Object.assign(appConf, app)
}

export default createApp
