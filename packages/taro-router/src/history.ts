import { createBrowserHistory, createHashHistory, History } from 'history'

export let history: History

export function setHistoryMode (mode?: 'hash' | 'browser', basename?: string) {
  const obj = basename ? { basename } : undefined
  if (mode === 'hash') {
    history = createHashHistory(obj)
  } else {
    // default is browser
    history = createBrowserHistory(obj)
  }
}
