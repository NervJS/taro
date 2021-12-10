import { shouldBeObject, getParameterError } from '../../utils/odd'

export function setNavigationBarTitle (options) {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `setNavigationBarTitle${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { title, success, fail, complete } = options
  const res = { errMsg: 'setNavigationBarTitle:ok' }

  if (!title || typeof title !== 'string') {
    res.errMsg = getParameterError({
      name: 'setNavigationBarTitle',
      para: 'title',
      correct: 'String',
      wrong: title
    })
    console.error(res.errMsg)
    typeof fail === 'function' && fail(res)
    typeof complete === 'function' && complete(res)
    return Promise.reject(res)
  }

  if (document.title !== title) {
    document.title = title
  }

  typeof success === 'function' && success(res)
  typeof complete === 'function' && complete(res)

  return Promise.resolve(res)
}

/**
 * 设置页面导航条颜色
 * @param {NavigationBarColorParam} options
 */
export function setNavigationBarColor (options) {
  const meta = document.createElement('meta')
  meta.setAttribute('name', 'theme-color')
  meta.setAttribute('content', options.backgroundColor)
  document.head.appendChild(meta)
}
