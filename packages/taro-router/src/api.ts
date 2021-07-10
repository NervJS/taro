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
  return new Promise<void>((resolve, reject) => {
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
  return reLaunch(option)
}

export async function reLaunch (option: Option) {
  // 模拟小程序reLaunch效果，清空已有路由
  if (stacks.length > 1) {
    navigateBack({ delta: stacks.length - 1 })
    // 如果不添加延时会导致redirectTo时还是在当前路由操作
    await new Promise(resolve => setTimeout(resolve, 10))
  }
  return redirectTo(option)
}

export function getCurrentPages () {
  return stacks
}
