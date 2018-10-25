/**
 * Filename: /src/lib/utils.js
 * Created Date: 2018-05-27 03:48:58
 * Author: Littly
 * Copyright (c) 2018 JD.COM
 */

/**
 * 将hash路径转换为全路径
 *
 * @param {string} url hash路径
 * @returns {string} 带hash的全路径
 */
const convertToFullUrl = url => {
  const hashIndex = window.location.href.indexOf('#')
  return window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + url
}

/**
 * 将location.hash更换为新的hash
 *
 * @param {string} url 待跳转的hash路径
 */
const pushHash = url => {
  window.location.hash = url
}

/**
 * 将当前的hash路径替换为新的
 *
 * @param {string} param0
 * @param {string} param0.url
 * @param {string} param0.state
 */
const replaceHash = ({ url, state }) => {
  window.history.replaceState(state, '', convertToFullUrl(url))
}

/**
 * 获取当前hash路径
 *
 * @returns {string} hash路径
 */
const getCurrentHash = () => {
  const href = window.location.href
  const hashIndex = href.indexOf('#')
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1)
}

/**
 * 标准化路径（绝对路径，不带问号）
 *
 * @param {string} url 待转换的路径
 */
const normalizeUrl = url => {
  url = url.replace(/\?$/, '')
  return url.charAt(0) === '/' ? url : `/${url}`
}

let counter = 0
/**
 * @typedef {object} location
 * @property {string} routerIdx 页面对应的routerIdx
 * @property {string} fullUrl 路径
 * @property {string} pageId  location的唯一标识
 * @property {string} params query中的参数
 * @property {string} url 路径的主体部分
 */
/**
 * 生成location对象
 *
 * @param {string} fullUrl 待处理的路径
 * @param {number} state 页面对应的state
 * @return {location} location对象
 */
const createLocation = (fullUrl, state) => {
  fullUrl = decodeURIComponent(fullUrl)
  const url = fullUrl.split('?')[0]

  const params = {}
  const queryIndex = fullUrl.indexOf('?')
  if (queryIndex !== -1) {
    const queryString = fullUrl.substring(queryIndex + 1)
    queryString.split('&').forEach(pair => {
      const temp = pair.split('=')
      params[temp[0]] = temp[1]
    })
  }
  return {
    state,
    fullUrl,
    pageId: counter++,
    params,
    url
  }
}

export { pushHash, replaceHash, convertToFullUrl, getCurrentHash, normalizeUrl, createLocation }
