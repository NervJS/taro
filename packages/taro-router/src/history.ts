import { BrowserHistoryOptions, createBrowserHistory, createHashHistory, History } from 'history'

export let history: History

let basename = '/'

export function setHistoryMode (mode?: 'hash' | 'browser', base = '/') {
  const options: BrowserHistoryOptions = {
    window
  }
  basename = base
  if (mode === 'browser') {
    history = createBrowserHistory(options)
  } else {
    // default is hash
    history = createHashHistory(options)
  }
}

export function parsePath (url = '') {
  return basename.replace(/\/$/, '') + '/' + url.replace(/^\//, '')
}
