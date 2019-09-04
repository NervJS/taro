import Taro from '@tarojs/taro-h5'
import invariant from 'invariant'
import rp from 'resolve-pathname'

import { stripLeadingSlash, stripTrailingSlash } from '../history/PathUtils'
import { History } from '../utils/types'

type SuccessCallback = (res: any) => any
type FailCallback = (err: any) => any
type CompleteCallback = () => any
type Result = { errMsg?: string }

type CustomRoutes = Record<string, string>

interface RouterConfig {
  customRoutes: CustomRoutes
  basename: string
  currentPagename: string
}

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

let basename = ''
let currentPagename = ''

const relaunchUrlKey = '__relaunchUrl'

const addHtmlExtname = (str: string) => {
  return /\.html\b/.test(str)
    ? str
    : `${str}.html`
}

const getTargetUrl = (url: string, customRoutes: CustomRoutes) => {
  const matched = url.match(/([\s\S]*)(\?[\s\S]*)?/) || []
  const pathname = matched[1] || ''
  const search = matched[2] || ''
  
  const targetUrl = rp(pathname, currentPagename)
  const nextPagename = addHtmlExtname(stripLeadingSlash(customRoutes[targetUrl] || targetUrl))
  return `${basename}/${nextPagename}${search}`
}

const createNavigateTo = ({ customRoutes }: RouterConfig, history?: History) => {
  return function ({ url }: NavigateToOption): Promise<Result> {
    const res: Result = {}

    try {
      invariant(url, 'navigateTo must be called with a url')
      if (/^(https?:)\/\//.test(url)) {
        window.location.assign(url)
      } else if (history) {
        history.push(url)
      } else {
        window.location.assign(getTargetUrl(url, customRoutes))
      }
      res.errMsg = 'navigateTo:ok'
      return Promise.resolve(res)
    } catch (e) {
      res.errMsg = `navigateTo:fail ${e.message}`
      return Promise.reject(res)
    }
  }
}

const createNavigateBack = ({ customRoutes }: RouterConfig, history?: History) => {
  return function (opts: NavigateBackOption = {}) {
    const res: Result = {}
    try {
      const { delta = 1 } = opts
      invariant(delta >= 0, 'navigateBack must be called with a delta greater than 0')
      if (history) {
        history.go(-delta)
      } else {
        window.history.go(-delta)
      }

      res.errMsg = 'navigateBack:ok'
      return Promise.resolve(res)
    } catch (e) {
      res.errMsg = `navigateBack:fail ${e.message}`
      return Promise.reject(res)
    }
  }
}

const createRedirectTo = ({ customRoutes }: RouterConfig, history?: History) => {
  return function ({ url }: RedirectToOption) {
    const res: Result = {}
    
    try {
      invariant(url, 'redirectTo must be called with a url')

      if (/^(https?:)\/\//.test(url)) {
        window.location.assign(url);
      } if (history) {
        history.replace(url)
      } else {
        window.location.replace(getTargetUrl(url, customRoutes))
      }
      res.errMsg = 'redirectTo:ok'
      return Promise.resolve(res)
    } catch (e) {
      res.errMsg = `redirectTo:fail ${e.message}`
      return Promise.reject(res)
    }
  }
}

const createReLaunch = ({ customRoutes }: RouterConfig, history?: History) => {
  try {
    const relaunchUrl = localStorage.getItem(relaunchUrlKey)
    if (relaunchUrl) {
      localStorage.setItem(relaunchUrlKey, '')
      location.replace(relaunchUrl)
    }
  } catch (e) {
    console.log(e.message)
  }
  return function ({ url }) {
    const res: Result = {}
    try {
      if (history) {
        history.go(-(history.length - 1))
        if (/^(https?:)\/\//.test(url)) {
          window.location.assign(url);
        } else {
          history.replace(url)
        }
      } else {
        localStorage.setItem(relaunchUrlKey, getTargetUrl(url, customRoutes))
        window.history.go(-(window.history.length - 1))
      }
      res.errMsg = 'reLaunch:ok'
      return Promise.resolve(res)
    } catch (e) {
      res.errMsg = `reLaunch:fail ${e.message}`
      return Promise.reject(res)
    }
  }
}

const mountApis = (routerConfig: RouterConfig, history?: History) => {
  currentPagename = routerConfig.currentPagename
  basename = stripTrailingSlash(routerConfig.basename)
  Taro.navigateTo = createNavigateTo(routerConfig, history)
  Taro.navigateBack = createNavigateBack(routerConfig, history)
  Taro.redirectTo = createRedirectTo(routerConfig, history)
  Taro.reLaunch = createReLaunch(routerConfig, history)
}

export default mountApis
