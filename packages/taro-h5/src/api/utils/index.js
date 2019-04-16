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
  el.style.webkitTransform = val
  el.style.transform = val
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
    .map(key => (`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)).join('&')
}

function temporarilyNotSupport (apiName) {
  return () => console.error(`暂时不支持 API ${apiName}`)
}

function weixinCorpSupport (apiName) {
  return () => console.error(`h5端仅在微信公众号中支持 API ${apiName}`)
}

function permanentlyNotSupport (apiName) {
  return () => console.error(`不支持 API ${apiName}`)
}

const VALID_COLOR_REG = /^#\d{6}$/

const isValidColor = (color) => {
  return VALID_COLOR_REG.test(color)
}

const createCallbackManager = () => {
  const callbacks = []

  const add = (opt) => {
    callbacks.push(opt)
  }

  const remove = (opt) => {
    const pos = callbacks.findIndex(({ callback }) => {
      return callback === opt.callback
    })
    if (pos > -1) {
      callbacks.splice(pos, 1)
    }
  }

  const count = () => callbacks.length
  const trigger = (...args) => {
    callbacks.forEach(({ callback, ctx }) => {
      callback.call(ctx, ...args)
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
    : () =>  el.scrollHeight

  const getPos = el === window
    ? () => window.pageYOffset
    : () => el.scrollTop

  const getClientHeight = el === window
    ? () => window.screen.height
    : () => el.clientHeight

  const listen = callback => {
    el.addEventListener('scroll', callback)
  }
  const unlisten = callback => {
    el.removeEventListener('scroll', callback)
  }

  const isReachBottom = (distance = 0) => {
    return getScrollHeight() - getPos() - getClientHeight() < distance
  }

  return { listen, unlisten, getPos, isReachBottom }
}

function processApis (apiName, defaultOptions, formatResult = res => res, formatParams = options => options) {
  if (!window.wx) {
    return weixinCorpSupport(apiName)
  }
  return options => {
    options = options || {}
    let obj = Object.assign({}, defaultOptions, options)
    const p = new Promise((resolve, reject) => {
      ;['fail', 'success', 'complete'].forEach(k => {
        obj[k] = res => {
          options[k] && options[k](res)
          if (k === 'success') {
            resolve(formatResult(res))
          } else if (k === 'fail') {
            reject(formatResult(res))
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
const easeInOut = t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1

const getTimingFunc = (easeFunc, frameCnt) => {
  return x => {
    const t = x / (frameCnt - 1)
    return easeFunc(t)
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
  processApis,
  findRef,
  easeInOut,
  getTimingFunc
}
