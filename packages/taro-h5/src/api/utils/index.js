function shouleBeObject (target) {
  if (target && typeof target === 'object') return { res: true }
  return {
    res: false,
    msg: getParameterError({
      correct: 'Object',
      wrong: target
    })
  }
}

function getParameterError ({ name = '', para, correct, wrong }) {
  const parameter = para ? `parameter.${para}` : 'parameter'
  const errorType = upperCaseFirstLetter(wrong === null ? 'Null' : typeof wrong)
  return `${name}:fail parameter error: ${parameter} should be ${correct} instead of ${errorType}`
}

function upperCaseFirstLetter (string) {
  if (typeof string !== 'string') return string
  string = string.replace(/^./, match => match.toUpperCase())
  return string
}

function inlineStyle (style) {
  let res = ''
  for (let attr in style) res += `${attr}: ${style[attr]};`
  if (res.indexOf('display: flex;') >= 0) res += 'display: -webkit-box;display: -webkit-flex;'
  res = res.replace(/transform:(.+?);/g, (s, $1) => `${s}-webkit-transform:${$1};`)
  res = res.replace(/flex-direction:(.+?);/g, (s, $1) => `${s}-webkit-flex-direction:${$1};`)
  return res
}

function setTransform (el, val) {
  el.style.transform = val
  el.style.OTransform = val
  el.style.msTransform = val
  el.style.MozTransform = val
  el.style.WebkitTransform = val
}

function isFunction (obj) {
  return typeof obj === 'function'
}

function successHandler (success, complete) {
  return function (res) {
    isFunction(success) && success(res)
    isFunction(complete) && complete(res)
    return Promise.resolve(res)
  }
}

function errorHandler (fail, complete) {
  return function (res) {
    isFunction(fail) && fail(res)
    isFunction(complete) && complete(res)
    return Promise.reject(res)
  }
}

function serializeParams (params) {
  if (!params) {
    return ''
  }
  return Object.keys(params)
    .map(key => (
      `${encodeURIComponent(key)}=${typeof (params[key]) === 'object'
        ? encodeURIComponent(JSON.stringify(params[key]))
        : encodeURIComponent(params[key])}`))
    .join('&')
}

function temporarilyNotSupport (apiName) {
  return () => {
    const errMsg = `暂时不支持 API ${apiName}`
    console.error(errMsg)
    return Promise.reject({
      errMsg
    })
  }
}

function weixinCorpSupport (apiName) {
  return () => {
    const errMsg = `h5端仅在微信公众号中支持 API ${apiName}`
    console.error(errMsg)
    return Promise.reject({
      errMsg
    })
  }
}

function permanentlyNotSupport (apiName) {
  return () => {
    const errMsg = `不支持 API ${apiName}`
    console.error(errMsg)
    return Promise.reject({
      errMsg
    })
  }
}

const VALID_COLOR_REG = /^#[0-9a-fA-F]{6}$/

const isValidColor = (color) => {
  return VALID_COLOR_REG.test(color)
}

const createCallbackManager = () => {
  const callbacks = []

  /**
   * 添加回调
   * @param {{ callback: function, ctx: any } | function} opt
   */
  const add = (opt) => {
    callbacks.push(opt)
  }

  /**
   * 移除回调
   * @param {{ callback: function, ctx: any } | function} opt
   */
  const remove = (opt) => {
    let pos = -1
    callbacks.forEach((callback, k) => {
      if (callback === opt) {
        pos = k
      }
    })
    if (pos > -1) {
      callbacks.splice(pos, 1)
    }
  }

  /**
   * 获取回调函数数量
   * @return {number}
   */
  const count = () => callbacks.length

  /**
   * 触发回调
   * @param  {...any} args 回调的调用参数
   */
  const trigger = (...args) => {
    callbacks.forEach(opt => {
      if (typeof opt === 'function') {
        opt(...args)
      } else {
        const { callback, ctx } = opt
        callback.call(ctx, ...args)
      }
    })
  }

  return {
    add,
    remove,
    count,
    trigger
  }
}

const createScroller = () => {
  let el = document.querySelector('.taro-tabbar__panel') || window

  const getScrollHeight = el === window
    ? () => document.documentElement.scrollHeight
    : () => el.scrollHeight

  const getPos = el === window
    ? () => window.pageYOffset
    : () => el.scrollTop

  const getClientHeight = el === window
    ? () => window.screen.height
    : () => el.clientHeight

  const listen = callback => {
    el.addEventListener('scroll', callback)
    document.body.addEventListener('touchmove', callback)
  }
  const unlisten = callback => {
    el.removeEventListener('scroll', callback)
    document.body.removeEventListener('touchmove', callback)
  }

  const isReachBottom = (distance = 0) => {
    return getScrollHeight() - getPos() - getClientHeight() < distance
  }

  return { listen, unlisten, getPos, isReachBottom }
}

function processOpenapi (apiName, defaultOptions, formatResult = res => res, formatParams = options => options) {
  if (!window.wx) {
    return weixinCorpSupport(apiName)
  }
  return options => {
    options = options || {}
    let obj = Object.assign({}, defaultOptions, options)
    const p = new Promise((resolve, reject) => {
      ;['fail', 'success', 'complete'].forEach(k => {
        obj[k] = oriRes => {
          const res = formatResult(oriRes)
          options[k] && options[k](res)
          if (k === 'success') {
            resolve(res)
          } else if (k === 'fail') {
            reject(res)
          }
        }
      })
      wx[apiName](formatParams(obj))
    })
    return p
  }
}

const findRef = (refId, componentInstance) => {
  if (componentInstance.isRoute) return
  return componentInstance[refId] || findRef(refId, componentInstance.vnode._owner)
}

/**
 * ease-in-out的函数
 * @param {number} t 0-1的数字
 */
const easeInOut = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1

const getTimingFunc = (easeFunc, frameCnt) => {
  return x => {
    const t = x / (frameCnt - 1)
    return easeFunc(t)
  }
}

/**
 * use closure function to store document.body.style in memory when loaded
 */
const bodyStatusClosure = (() => {
  let hasCalculated
  let bodyStyle
  // use object copy to prevent document.body style read issue
  const bodyCopy = Object.assign({}, document.body.style)
  if (!hasCalculated) {
    bodyStyle = bodyCopy
  }
  hasCalculated = true
  return {
    getInlineStyle: () => bodyStyle && bodyStyle.cssText,
    hasCalculated
  }
})()

/**
 * get scrollTop and compact for all possible browser
 *
 * @returns scrollTop
 */
function getScrollTop () {
  if (document.scrollingElement) {
    return document.scrollingElement.scrollTop
  } else {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
  }
}

/**
 * compact for scrollTop
 *
 * for more info @see: https://www.zhangxinxu.com/wordpress/2019/02/document-scrollingelement/
 * @param scrollTop scrollTop which needs to be reset
 */
function setScrollTop (scrollTop) {
  if (document.scrollingElement) {
    document.scrollingElement.scrollTop = scrollTop
  } else {
    document.documentElement.scrollTop = scrollTop
    document.body.scrollTop = scrollTop
  }
}

let scrollTop = 0

/**
 * interactive helper to provide position fixed when modal/toast/actionSheet open.
 * And reset body style as default when close.
 */
const interactiveHelper = () => {
  return {
    handleAfterCreate: () => {
      scrollTop = getScrollTop()
      const bodyFixStyle = {
        'position': 'fixed',
        'width': '100%',
        'overflow': 'hidden',
        'top': `${-scrollTop}px`
      }
      document.body.setAttribute('style', inlineStyle(bodyFixStyle))
    },
    handleBeforeDestroy: () => {
      const bodyInlineStyle = bodyStatusClosure.getInlineStyle() || {}
      document.body.style = bodyInlineStyle
      setScrollTop(scrollTop)
    }
  }
}

export {
  shouleBeObject,
  getParameterError,
  inlineStyle,
  setTransform,
  successHandler,
  errorHandler,
  serializeParams,
  temporarilyNotSupport,
  weixinCorpSupport,
  permanentlyNotSupport,
  isValidColor,
  isFunction,
  createCallbackManager,
  createScroller,
  processOpenapi,
  findRef,
  easeInOut,
  getTimingFunc,
  interactiveHelper
}
