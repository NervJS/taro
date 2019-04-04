import { History } from '../utils/types'
import invariant from 'invariant';
import Taro from '@tarojs/taro-h5';

type SuccessCallback = (res: any) => any
type FailCallback = (err: any) => any
type CompleteCallback = () => any
type Result = { errMsg?: string }

interface NavigateToOption {
  url: string
  success?: SuccessCallback
  fail?: FailCallback
  complete?: CompleteCallback
}

interface NavigateBackOption {
  delta?: number
  success?: SuccessCallback
  fail?: FailCallback
  complete?: CompleteCallback
}

interface RedirectToOption {
  url: string
  success?: SuccessCallback
  fail?: FailCallback
  complete?: CompleteCallback
}

const createNavigateTo = (history: History) => {
  return function ({ url }: NavigateToOption): Promise<Result> {
    const res: Result = {}

    try {
      invariant(url, 'navigateTo must be called with a url')
      if (/^(https?:)\/\//.test(url)) {
        window.location.assign(url)
      } else {
        history.push(url)
      }
      res.errMsg = 'navigateTo:ok'
      return Promise.resolve(res)
    } catch (e) {
      res.errMsg = `navigateTo:fail ${e.message}`
      return Promise.reject(res)
    }
  }
}

const createNavigateBack = (history: History) => {
  return function (opts: NavigateBackOption = {}) {
    const res: Result = {}
    try {
      const { delta = 1 } = opts
      invariant(delta >= 0, 'navigateBack must be called with a delta greater than 0')

      history.go(-delta)
      res.errMsg = 'navigateBack:ok'
      return Promise.resolve(res)
    } catch (e) {
      res.errMsg = `navigateBack:fail ${e.message}`
      return Promise.reject(res)
    }
  }
}

const createRedirectTo = (history: History) => {
  return function ({ url }: RedirectToOption) {
    const res: Result = {}
    
    try {
      invariant(url, 'redirectTo must be called with a url')

      if (/^(https?:)\/\//.test(url)) {
        window.location.assign(url);
      } else {
        history.replace(url)
      }
      res.errMsg = 'redirectTo:ok'
      return Promise.resolve(res)
    } catch (e) {
      res.errMsg = `redirectTo:fail ${e.message}`
      return Promise.reject(res)
    }
  }
}

const createReLaunch = (history: History) => {
  return function ({ url }) {
    const res: Result = {}
    try {
      history.go(-(history.length - 1))
      if (/^(https?:)\/\//.test(url)) {
        window.location.assign(url);
      } else {
        history.replace(url)
      }
      res.errMsg = 'reLaunch:ok'
      return Promise.resolve(res)
    } catch (e) {
      res.errMsg = `reLaunch:fail ${e.message}`
      return Promise.reject(res)
    }
  }
}

const mountApis = (history: History) => {
  Taro.navigateTo = createNavigateTo(history)
  Taro.navigateBack = createNavigateBack(history)
  Taro.redirectTo = createRedirectTo(history)
  Taro.reLaunch = createReLaunch(history)
}

export default mountApis
