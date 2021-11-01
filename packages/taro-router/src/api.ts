import { parsePath } from 'history'
import { stacks } from './stack'
import { history, prependBasename } from './history'
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
  const pathPieces = parsePath(option.url)

  // 处理自定义路由
  Object.keys(routesAlias).forEach(key => {
    if (addLeadingSlash(key) === addLeadingSlash(pathPieces.pathname)) {
      pathPieces.pathname = routesAlias[key]
    }
  })

  // 处理 basename
  pathPieces.pathname = prependBasename(pathPieces.pathname)

  // hack fix history v5 bug: https://github.com/remix-run/history/issues/814
  if (!pathPieces.search) pathPieces.search = ''

  return pathPieces
}

function navigate (option: Option | NavigateBackOption, method: 'navigateTo' | 'redirectTo' | 'navigateBack') {
  const { success, complete, fail } = option
  let failReason

  try {
    if ('url' in option) {
      const pathPieces = processNavigateUrl(option)
      const state = { timestamp: Date.now() }
      if (method === 'navigateTo') {
        history.push(pathPieces, state)
      } else if (method === 'redirectTo') {
        history.replace(pathPieces, state)
      }
    } else if (method === 'navigateBack') {
      setHistoryBackDelta(option.delta)
      history.go(-option.delta)
    }
  } catch (error) {
    failReason = error
  }

  return new Promise<void>((resolve, reject) => {
    if (failReason) {
      fail && fail(failReason)
      complete && complete()
      reject(failReason)
      return
    }

    const unlisten = history.listen(() => {
      success && success()
      complete && complete()
      resolve()
      unlisten()
    })
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
  // TODO: 清除掉所有的栈去目标页面
  return redirectTo(option)
}

export function reLaunch (option: Option) {
  // TODO: 清除掉所有的栈去目标页面
  return redirectTo(option)
}

export function getCurrentPages () {
  return stacks
}
