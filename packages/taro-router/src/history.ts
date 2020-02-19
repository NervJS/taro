import { createBrowserHistory, createHashHistory } from 'history'

export let history = createBrowserHistory()

export function setHashHistory () {
  history = createHashHistory()
}
