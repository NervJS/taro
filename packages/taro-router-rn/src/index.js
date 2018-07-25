import { createStackNavigator } from 'react-navigation'
import queryString from 'query-string'

function getWrappedScreen (Screen, Taro) {
  class WrappedScreen extends Screen {
    constructor (props, context) {
      super(props, context)
      Taro.navigateTo = this.navigateTo
      Taro.redirectTo = this.redirectTo
      Taro.navigateBack = this.navigateBack
    }

    componentDidMount () {
      super.componentDidMount && super.componentDidMount()
      super.componentDidShow && super.componentDidShow()
    }

    componentWillUnmount () {
      super.componentDidHide && super.componentDidHide()
      super.componentWillUnmount && super.componentWillUnmount()
    }

    navigateTo (url, success, fail, complete) {
      let {path, query} = queryString.parseUrl(url)

      try {
        this.props.navigation.push(path, query)
      } catch (e) {
        fail && fail(e)
        complete && complete(e)
        throw e
      }
      success && success()
      complete && complete()
    }

    redirectTo (url, success, fail, complete) {
      let {path, query} = queryString.parseUrl(url)

      try {
        this.props.navigation.replace(path, query)
      } catch (e) {
        fail && fail(e)
        complete && complete(e)
        throw e
      }
      success && success()
      complete && complete()
    }

    navigateBack (delta = 1) {
      this.props.navigation.goBack()
    }
  }

  return WrappedScreen
}

const initRouter = (pageArr, Taro) => {
  let RouteConfigs
  pageArr.forEach(v => {
    const pageKey = v[0]
    const pagePath = v[1]
    let Screen = require(pagePath).default
    RouteConfigs[pageKey] = getWrappedScreen(Screen, Taro)
  })
  return createStackNavigator(RouteConfigs, {
    initialRouteName: pageArr[0][0]
  })
}

export default {initRouter}

export { initRouter }
