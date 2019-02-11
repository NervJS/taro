import Taro from '@tarojs/taro'
import { create } from 'dva-core'
import { createLogger } from 'redux-logger'

let app
let store
let dispatch

function setValue (state, {payload}) {
  return {...state, ...payload}
}

function clear (state, {payload}) {
  return {isShow: false}
}

function createApp (opt) {
  // redux log
  opt.onAction = [createLogger()]
  app = create(opt)

  // 适配支付宝小程序
  if (Taro.getEnv() === Taro.ENV_TYPE.ALIPAY) {
    window.global = {}
  }
  if (!global.registered) {
    opt.models.forEach(model => {
      model.state.isShow = true
      model.reducers.setValue = setValue
      model.reducers.clear = clear
      app.model(model)
    })
  }
  global.registered = true
  app.start()

  store = app._store
  app.getStore = () => store

  dispatch = store.dispatch
  app.dispatch = dispatch
  return app
}

export default {
  createApp,
  getDispatch () {
    return app.dispatch
  }
}
