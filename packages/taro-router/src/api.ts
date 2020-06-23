import { stacks } from './stack'
import { history } from './history'

interface Base {
  success?: Function
  fail?: Function
  complete?: Function
}

interface Option extends Base {
  url: string
}

interface NavigateBackOption extends Base {
  delta: number
}

function navigate (option: Option | NavigateBackOption, method: 'navigateTo' | 'redirectTo' | 'navigateBack') {
  const { success, complete, fail } = option
  let failReason
  try {
    if (method === 'navigateTo') {
      history.push((option as Option).url)
    } else if (method === 'redirectTo') {
      history.replace((option as Option).url)
    } else if (method === 'navigateBack') {
      history.go(-(option as NavigateBackOption).delta)
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

export function navigateBack (options: NavigateBackOption = { delta: 1 }) {
  if (!options.delta || options.delta < 1) {
    options.delta = 1
  }
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
