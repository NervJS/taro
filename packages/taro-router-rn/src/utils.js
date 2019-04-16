export const HEADER_CONFIG_MAP = {
  navigationBarTitleText: 'title', // 导航栏标题文字内容
  navigationBarTextStyle: 'headerTintColor', // 导航栏标题颜色，仅支持 black/white
  navigationBarBackgroundColor: 'backgroundColor', // 导航栏背景颜色
  enablePullDownRefresh: 'enablePullDownRefresh', // 是否全局开启下拉刷新，暂时放这里吧
  navigationStyle: 'navigationStyle', // 导航栏样式，仅支持以下值：default 默认样式 custom 自定义导航栏，只保留右上角胶囊按钮
  disableScroll: 'disableScroll' // 设置为 true 则页面整体不能上下滚动；只在页面配置中有效，无法在 app.json 中设置该项
}

export function getNavigationOptions (config = {}) {
  if (typeof config !== 'object') {
    throw new Error('window 必须是对象')
  }
  let navigationOptions = {}
  Object.keys(config).forEach(function (key) {
    if (key in HEADER_CONFIG_MAP) {
      navigationOptions[HEADER_CONFIG_MAP[key]] = config[key]
    }
  })
  return navigationOptions
}

// import { findDOMNode } from 'nervjs'

export function shouleBeObject (target) {
  if (target && typeof target === 'object') return {res: true}
  return {
    res: false,
    msg: getParameterError({
      correct: 'Object',
      wrong: target
    })
  }
}

export function getParameterError ({name = '', para, correct, wrong}) {
  const parameter = para ? `parameter.${para}` : 'parameter'
  const errorType = upperCaseFirstLetter(wrong === null ? 'Null' : typeof wrong)
  return `${name}:fail parameter error: ${parameter} should be ${correct} instead of ${errorType}`
}

export function upperCaseFirstLetter (string) {
  if (typeof string !== 'string') return string
  string = string.replace(/^./, match => match.toUpperCase())
  return string
}

export function isFunction (obj) {
  return typeof obj === 'function'
}

export function successHandler (success, complete) {
  return function (res) {
    isFunction(success) && success(res)
    isFunction(complete) && complete(res)
    return Promise.resolve(res)
  }
}

export function errorHandler (fail, complete) {
  return function (res) {
    isFunction(fail) && fail(res)
    isFunction(complete) && complete(res)
    return Promise.reject(res)
  }
}

export function serializeParams (params) {
  if (!params) {
    return ''
  }
  return Object.keys(params)
    .map(key => (`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)).join('&')
}

export function temporarilyNotSupport (apiName) {
  return () => console.error(`暂时不支持 API ${apiName}`)
}

export function permanentlyNotSupport (apiName) {
  return () => console.error(`不支持 API ${apiName}`)
}

const VALID_COLOR_REG = /^#\d{6}$/

export const isValidColor = (color) => {
  return VALID_COLOR_REG.test(color)
}

export const createCallbackManager = () => {
  const callbacks = []

  const add = (opt) => {
    callbacks.push(opt)
  }

  const remove = (opt) => {
    const pos = callbacks.findIndex(({callback}) => {
      return callback === opt.callback
    })
    if (pos > -1) {
      callbacks.splice(pos, 1)
    }
  }

  const count = () => callbacks.length
  const trigger = (...args) => {
    callbacks.forEach(({callback, ctx}) => {
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
