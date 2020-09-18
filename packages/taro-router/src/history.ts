import { createBrowserHistory, createHashHistory, History } from 'history'

export let history: History

export function setHistoryMode (mode?: 'hash' | 'browser', basename?: string) {
  const obj = basename ? { basename } : undefined
  if (mode === 'browser') {
    history = createBrowserHistory(obj)
  } else {
    // default is hash
    history = createHashHistory(obj)
  }
}
