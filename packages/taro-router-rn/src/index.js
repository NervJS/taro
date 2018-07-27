import { createStackNavigator } from 'react-navigation'
import queryString from 'query-string'

function getWrappedScreen (Screen, Taro) {
  class WrappedScreen extends Screen {
    constructor (props, context) {
      super(props, context)
      Taro.navigateTo = this.wxNavigateTo.bind(this)
      Taro.redirectTo = this.wxRedirectTo.bind(this)
      Taro.navigateBack = this.wxNavigateBack.bind(this)
    }

    componentDidMount () {
      super.componentDidMount && super.componentDidMount()
      super.componentDidShow && super.componentDidShow()
    }

    componentWillUnmount () {
      super.componentDidHide && super.componentDidHide()
      super.componentWillUnmount && super.componentWillUnmount()
    }

    wxNavigateTo ({url, success, fail, complete}) {
      let obj = queryString.parseUrl(url)
      console.log(obj)
      try {
        this.props.navigation.push(obj.url.replace(/\//g, ''), obj.query)
      } catch (e) {
        fail && fail(e)
        complete && complete(e)
        throw e
      }
      success && success()
      complete && complete()
    }

    wxRedirectTo ({url, success, fail, complete}) {
      let obj = queryString.parseUrl(url)
      console.log(obj)
      try {
        this.props.navigation.replace(obj.url.replace(/\//g, ''), obj.query)
      } catch (e) {
        fail && fail(e)
        complete && complete(e)
        throw e
      }
      success && success()
      complete && complete()
    }

    wxNavigateBack ({delta = 1}) {
      this.props.navigation.goBack()
    }
  }

  return WrappedScreen
}

const initRouter = (pageArr, Taro, navigationOptions) => {
  let RouteConfigs = {}
  pageArr.forEach(v => {
    const pageKey = v[0]
    const Screen = v[1]
    RouteConfigs[pageKey] = getWrappedScreen(Screen, Taro)
  })
  return createStackNavigator(RouteConfigs, {
    initialRouteName: pageArr[0][0],
    navigationOptions
  })
}

export default {initRouter}

export { initRouter }
