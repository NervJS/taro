import { stacks } from './stack'
import { history } from './history'

interface Option {
  url: string
  success?: Function
  fail?: Function
  complete?: Function
}

function navigate (option: Option, method: 'navigateTo' | 'redirectTo' | 'navigateBack') {
  const { url, success, complete, fail } = option
  let failReason
  try {
    if (method === 'navigateTo') {
      history.push(url)
    } else if (method === 'redirectTo') {
      history.replace(url)
    } else if (method === 'navigateBack') {
      history.goBack()
    }
  } catch (error) {
    failReason = error
  }
  return new Promise((resolve, reject) => {
    if (failReason) {
      fail && fail(failReason)
      complete && complete()
      reject(failReason)
    } else {
      success && success()
      complete && complete()
      resolve()
    }
  })
}

export function navigateTo (option: Option) {
  return navigate(option, 'navigateTo')
}

export function redirectTo (option: Option) {
  return navigate(option, 'redirectTo')
}

export function navigateBack (options: Option) {
  return navigate(options, 'navigateBack')
}

export function switchTab (option: Option) {
  return navigateTo(option)
}

export function reLaunch (option: Option) {
  return redirectTo(option)
}

export function getCurrentPages () {
  return stacks
}
