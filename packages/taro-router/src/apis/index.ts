import { History } from '../utils/types'

type SuccessCallback = (res: any) => any
type FailCallback = (err: any) => any
type CompleteCallback = () => any

interface NavigateToOption {
  url: string
  success?: SuccessCallback
  fail?: FailCallback
  complete?: CompleteCallback
}

interface NavigateBackOption {
  delta: number
  success?: SuccessCallback
  fail?: FailCallback
  complete?: CompleteCallback
}

interface RedirectToOption {
  url: string
  success?: SuccessCallback
  fail?: FailCallback
  complete?: CompleteCallback
}

const createNavigateTo = (history: History) => {
  return function ({ url }: NavigateToOption) {
    try {
      if (/^(https?:)\/\//.test(url)) {
        window.location.assign(url);
      }
      history.push(url)
      return Promise.resolve()
    } catch (e) {
      return Promise.reject()
    }
  }
}

const createNavigateBack = (history: History) => {
  return function ({ delta }: NavigateBackOption) {
    try {
      history.go(delta)
      return Promise.resolve()
    } catch (e) {
      return Promise.reject()
    }
  }
}

const createRedirectTo = (history: History) => {
  return function ({ url }: RedirectToOption) {
    if (/^(https?:)\/\//.test(url)) {
      window.location.assign(url);
    }
    try {
      history.replace(url)
      return Promise.resolve()
    } catch (e) {
      return Promise.reject()
    }
  }
}

export { createNavigateTo, createNavigateBack, createRedirectTo }
