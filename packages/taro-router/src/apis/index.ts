import { History } from '../utils/types'
import invariant from 'invariant';

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
  delta?: number
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

    invariant(url, 'navigateTo must be called with a url')

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
  return function (opts: NavigateBackOption = {}) {
    try {
      const { delta = 1 } = opts

      invariant(delta >= 0, 'navigateBack must be called with a delta greater than 0')

      history.go(-delta)
      return Promise.resolve()
    } catch (e) {
      return Promise.reject()
    }
  }
}

const createRedirectTo = (history: History) => {
  return function ({ url }: RedirectToOption) {

    invariant(url, 'redirectTo must be called with a url')
    
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
