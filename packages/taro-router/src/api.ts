import { stacks } from './stack'
import { history } from './history'
import { routesAlias, addLeadingSlash, setHistoryBackDelta } from './utils'

interface Base {
  success?: (...args: any[]) => void
  fail?: (...args: any[]) => void
  complete?: (...args: any[]) => void
}

interface Option extends Base {
  url: string
}

interface NavigateBackOption extends Base {
  delta: number
}

function processNavigateUrl (option: Option) {
  let url = option.url
  const matches = option.url.match(/[?&?].*/)
  let parameters = ''
  if (matches && matches.length) {
    parameters = matches[0]
    url = url.replace(parameters, '')
  }
  Object.keys(routesAlias).forEach(key => {
    if (addLeadingSlash(key) === addLeadingSlash(url)) {
      option.url = routesAlias[key] + parameters
    }
  })
}

function navigate (option: Option | NavigateBackOption, method: 'navigateTo' | 'redirectTo' | 'navigateBack') {
  const { success, complete, fail } = option
  let failReason
  if ((option as Option).url) {
    processNavigateUrl(option as Option)
  }
  try {
    if (method === 'navigateTo') {
      history.push((option as Option).url)
    } else if (method === 'redirectTo') {
      history.replace((option as Option).url)
    } else if (method === 'navigateBack') {
      setHistoryBackDelta((option as NavigateBackOption).delta)
      history.go(-(option as NavigateBackOption).delta)
    }
  } catch (error) {
    failReason = error
  }

  const unlisten = history.listen(() => {
    complete && complete()
    unlisten()
  })

  return new Promise<void>((resolve, reject) => {
    if (failReason) {
      fail && fail(failReason)
      reject(failReason)
    } else {
      success && success()
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
