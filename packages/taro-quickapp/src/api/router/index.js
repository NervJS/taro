import router from '@system.router'

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
    try {
      router[method]({
        uri: url.substr(0, url.lastIndexOf('/')),
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
  const params = {}
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
