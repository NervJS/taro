import { IH5RouterConfig } from '@tarojs/taro/types/compile'
import { BrowserHistoryOptions, createBrowserHistory, createHashHistory, History } from 'history'

export let history: History

let basename = '/'

export function setHistoryMode (mode?: IH5RouterConfig['mode'], base = '/') {
  const options: BrowserHistoryOptions = {
    window
  }
  basename = base

  if (mode === 'multi' || mode === 'browser') {
    history = createBrowserHistory(options)
  } else {
    // default is hash
    history = createHashHistory(options)
  }
}

export function prependBasename (url = '') {
  return basename.replace(/\/$/, '') + '/' + url.replace(/^\//, '')
}

export const hasBasename = (path = '', prefix = '') =>
  new RegExp('^' + prefix + '(\\/|\\?|#|$)', 'i').test(path)

export const stripBasename = (path = '', prefix = '') =>
  hasBasename(path, prefix) ? path.substr(prefix.length) : path
