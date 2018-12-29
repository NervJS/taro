import Nerv from 'nervjs'
import Taro from './index'

class Component extends Nerv.Component {
  get $router () {
    return Taro.getRouter()
  }
  set $router (args) {
    console.warn('Property "$router" is read-only.')
  }

  get $app () {
    return Taro.getApp()
  }

  set $app (app) {
    console.warn('Property "$app" is read-only.')
  }
}

export default Component
