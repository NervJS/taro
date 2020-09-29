import { createBrowserHistory, createHashHistory, History } from 'history'

export let history: History

export function setHistoryMode (mode?: 'hash' | 'browser', basename?: string) {
  const options = {
    basename
  }
  if (mode === 'browser') {
    history = createBrowserHistory(options)
  } else {
    // default is hash
    history = createHashHistory(options)
  }
}
