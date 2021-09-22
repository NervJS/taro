import { queryToJson } from '@tarojs/shared'
import { unsupport } from '../utils'

const router = require('@system.router')

function getRouterFunc (method) {
  const methodName = method === 'navigateTo' ? 'push' : 'replace'

  return function (options) {
    const [uri, queryString = ''] = options.url.split('?')
    const params = queryToJson(queryString)

    return new Promise(resolve => {
      router[methodName]({
        uri: uri.replace(/^\//, ''),
        params
      })
      resolve(null)
    })
  }
}

const navigateTo = getRouterFunc('navigateTo')
const redirectTo = getRouterFunc('redirectTo')

function navigateBack () {
  return new Promise(resolve => {
    router.back()
    resolve(null)
  })
}

function switchTab () {
  process.env.NODE_ENV !== 'production' && unsupport('switchTab')
}

function reLaunch () {
  process.env.NODE_ENV !== 'production' && unsupport('reLaunch')
}

export {
  navigateTo,
  redirectTo,
  navigateBack,
  switchTab,
  reLaunch
}
