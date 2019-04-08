// import { findDOMNode } from 'nervjs'

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

const createScroller = inst => {
  // const dom = findDOMNode(inst)
  const el = document.querySelector('.taro-tabbar__panel') || document.body

  const listen = callback => {
    el.addEventListener('scroll', callback)
  }
  const unlisten = callback => {
    el.removeEventListener('scroll', callback)
  }
  const getPos = () => el.scrollTop
  const isReachBottom = (distance = 0) => {
    return el.scrollHeight - el.scrollTop - el.clientHeight < distance
  }
  
  return { listen, unlisten, getPos, isReachBottom }
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
  createScroller
}
