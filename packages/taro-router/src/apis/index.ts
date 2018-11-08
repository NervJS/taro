import { History } from '../utils/types'
import { tryToCall } from '../utils';

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
  return async function ({ url, success, fail, complete }: NavigateToOption) {
    try {
      if (/^(https?:)\/\//.test(url)) {
        window.location.assign(url);
        return
      }
      history.push(url)
      tryToCall(success)
    } catch (e) {
      tryToCall(fail)
    } finally {
      tryToCall(complete)
    }
  }
}

const createNavigateBack = (history: History) => {
  return async function ({ delta, success, fail, complete }: NavigateBackOption) {
    try {
      history.go(delta)
      tryToCall(success)
    } catch (e) {
      tryToCall(fail)
    } finally {
      tryToCall(complete)
    }
  }
}

const createRedirectTo = (history: History) => {
  return async function ({ url, success, fail, complete }: RedirectToOption) {
    if (/^(https?:)\/\//.test(url)) {
      window.location.assign(url);
      return
    }
    try {
      history.replace(url)
      tryToCall(success)
    } catch (e) {
      tryToCall(fail)
    } finally {
      tryToCall(complete)
    }
  }
}

export { createNavigateTo, createNavigateBack, createRedirectTo }
