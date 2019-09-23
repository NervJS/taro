import router from '@system.router'
import appGlobal from '../../global'
import { addLeadingSlash, getUniqueKey } from '../../util'
import { cacheDataGet, cacheDataSet } from '../../data-cache'

const preloadPrivateKey = 'quick$PriPreload'
const preloadInitedComponent = 'quick$PriPreloadComponent'

export function navigateTo (options = {}) {
  return qappNavigate(options)
}

export function redirectTo (options = {}) {
  return qappNavigate(options, 'replace')
}

export function navigateBack (options = {}) {
  router.back()
}

export function switchTab (options = {}) {
  router.clear()
  return qappNavigate(options, 'replace')
}

export function getCurrentPages () {
  return router.getLength()
}

export function reLaunch (options = {}) {
  router.clear()
  return qappNavigate(options, 'replace')
}

function qappNavigate (options = {}, method = 'push') {
  const { url = '', success, fail, complete } = options
  const res = { errMsg: 'ok' }

  return new Promise((resolve, reject) => {
    let params = {}
    if (!url) {
      res.errMsg = 'url不能为空'
      fail && fail(res)
      reject(res)
      return
    }
    params = getUrlParams(url)
    const markIndex = url.indexOf('?')
    const componentPath = appGlobal.componentPath || ''
    let parseUrl = url.substr(0, markIndex >= 0 ? markIndex : url.length)
    const RelativeReg = /\.\.\//g
    if (componentPath && RelativeReg.test(parseUrl)) {
      //当前页面路径最后一级是文件，在计算路径时去除
      var componentRootDir = componentPath.substr(0, componentPath.lastIndexOf('/'))
      var pathArr = parseUrl.split('/')
      //计算..出现的次数，每出现一次就往上一层
      for(let path of pathArr) {
        if (path === '..') {
          componentRootDir = componentRootDir.substr(0, componentRootDir.lastIndexOf('/'))
        }
      }
      parseUrl = componentRootDir + '/' + parseUrl.replace(RelativeReg, '')
    }
    parseUrl = addLeadingSlash(parseUrl)
    appGlobal.taroRouterParamsCache = appGlobal.taroRouterParamsCache || {}
    appGlobal.taroRouterParamsCache[parseUrl] = params

    if (method === 'push' || method === 'replace') {
      const Component = cacheDataGet(parseUrl)
      if (Component) {
        const component = new Component()
        if (component.componentWillPreload) {
          const cacheKey = getUniqueKey()
          cacheDataSet(cacheKey, component.componentWillPreload(Object.assign({}, params)))
          cacheDataSet(preloadInitedComponent, component)
          params[preloadPrivateKey] = cacheKey
        }
      }
    }
    try {
      router[method]({
        uri: parseUrl.substr(0, parseUrl.lastIndexOf('/')),
        params
      })
      success && success(res)
      complete && complete(res)
      resolve(res)
    } catch (data) {
      res.errMsg = 'error'
      res.data = data
      fail && fail(res)
      reject(res)
    }
  })
}

function getUrlParams (url = '') {
  const params = {}
  url = url.replace(/#.*$/, '')
  const queryArray = url.split(/[?&]/).slice(1)
  queryArray.forEach(item => {
    const match = item.match(/([^=]+)=([^=]+)/)
    if (match != null) {
      params[match[1]] = decodeURIComponent(match[2])
    }
  })
  return params
}

export default {
  reLaunch,
  switchTab,
  navigateTo,
  redirectTo,
  navigateBack,
  getCurrentPages
}
