import { createBrowserHistory, createHashHistory, History } from 'history'

export let history: History

export function setHistoryMode (mode: 'hash' | 'browser') {
  if (mode === 'hash') {
    history = createHashHistory()
  } else {
    // default is browser
    history = createBrowserHistory()
  }
}
