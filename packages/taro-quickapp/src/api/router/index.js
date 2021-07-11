import router from '@system.router'
import * as path from '../path'

export function navigateTo (options = {}) {
  return qappNavigate(options)
}

export function redirectTo (options = {}) {
  return qappNavigate(options, 'replace')
}

export function navigateBack (options = { delta: 1 }) {
  const path = getCurrentPages().reverse()[options.delta].path
  router.back({
    path
  })
}

export function switchTab (options = {}) {
  router.clear()
  return qappNavigate(options, 'replace')
}

export function getCurrentPages () {
  return router.getPages()
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
    const [pathname, querystring] = url.split('?')
    params = getUrlParams(querystring)
    const parseUrl = getUrlPath(pathname)

    try {
      router[method]({
        uri: parseUrl,
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

function getUrlParams (querystring = '') {
  const params = {}
  querystring = querystring.replace(/#.*$/, '')
  const queryArray = querystring.split('&')
  queryArray.forEach(item => {
    const match = item.match(/([^=]+)=([^=]+)/)
    if (match != null) {
      params[match[1]] = decodeURIComponent(match[2])
    }
  })
  return params
}

function getUrlPath (pathname = '') {
  const currentPath = router.getState().path
  return path.resolve(currentPath, pathname, '..') // 去除index
}

export default {
  reLaunch,
  switchTab,
  navigateTo,
  redirectTo,
  navigateBack,
  getCurrentPages
}
