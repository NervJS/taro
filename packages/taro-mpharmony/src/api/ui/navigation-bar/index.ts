import Taro from '@tarojs/api'
import { addStyle } from '@tarojs/router/dist/style'
import { setTitle } from '@tarojs/router/dist/utils/navigate'

import { getParameterError, shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

/**
 * 导航条与Web层叠布局，导航条可见情况下Web页面顶部空出一定高度的留白
 */
function loadNavigationSytle () {
  if (typeof window === 'undefined') {
    return
  }
  // @ts-ignore
  const naviHeight = window.navigationHeight ? window.navigationHeight : 0
  const css = `
.taro_router .taro_page.taro_navigation_page {
  padding-top: ${naviHeight}px;
}

.taro-tabbar__container .taro_page.taro_navigation_page {
  max-height: calc(100vh - ${naviHeight}px);
}

.taro-tabbar__container .taro_page.taro_tabbar_page.taro_navigation_page {
  max-height: calc(100vh - 50px - ${naviHeight}px);
}`
  addStyle(css)
}

loadNavigationSytle()

/**
 * 显示页面导航条加载图标
 * 
 * @canUse showNavigationBarLoading
 */
export const showNavigationBarLoading: typeof Taro.showNavigationBarLoading = (options?) => {
  const { success, fail, complete } = (options || {}) as Exclude<typeof options, undefined>
  const handle = new MethodHandler({ name: 'showNavigationBarLoading', success, fail, complete })

  // @ts-ignore
  native.showNavigationBarLoading()
  return handle.success()
}

/**
 * 隐藏页面导航条加载图标
 * 
 * @canUse hideNavigationBarLoading
 */
export const hideNavigationBarLoading: typeof Taro.hideNavigationBarLoading = (options?) => {
  const { success, fail, complete } = (options || {}) as Exclude<typeof options, undefined>
  const handle = new MethodHandler({ name: 'hideNavigationBarLoading', success, fail, complete })

  // @ts-ignore
  native.hideNavigationBarLoading()
  return handle.success()
}

/**
 * 设置页面导航条标题
 * 
 * @canUse setNavigationBarTitle
 * @__object [title]
 */
export const setNavigationBarTitle: typeof Taro.hideNavigationBarLoading = (
  options?: Taro.setNavigationBarTitle.Option
) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `setNavigationBarTitle:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { title, success, fail, complete } = options as Exclude<typeof options, undefined>
  const handle = new MethodHandler({ name: 'setNavigationBarTitle', success, fail, complete })

  if (!title || typeof title !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'title',
        correct: 'String',
        wrong: title,
      }),
    })
  }

  setTitle(title)

  return handle.success()
}
/**
 * 设置页面导航条颜色
 * 
 * @canUse setNavigationBarColor
 * @__object [backgroundColor, frontColor, animation]
 */
export const setNavigationBarColor: typeof Taro.setNavigationBarColor = (options) => {
  const apiName = 'setNavigationBarColor'
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${apiName}:fail ${isObject.msg}` }
    return Promise.reject(res)
  }

  const { frontColor, backgroundColor, success, fail, complete, ...otherOptions } = options as Exclude<
    typeof options,
  undefined
  >
  const handle = new MethodHandler({ name: apiName, success, fail, complete })

  if (!frontColor || typeof frontColor !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'frontColor',
        correct: 'String',
        wrong: frontColor,
      }),
    })
  }

  if (frontColor && !['#000000', '#ffffff'].includes(frontColor)) {
    return handle.fail({
      errMsg: `invalid frontColor "${frontColor}"`,
    })
  }

  if (!backgroundColor || typeof backgroundColor !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'backgroundColor',
        correct: 'String',
        wrong: backgroundColor,
      }),
    })
  }
  // @ts-ignore
  native.setNavigationBarColor({ frontColor, backgroundColor, ...otherOptions })
  return handle.success()
}

/**
 * 隐藏返回首页按钮
 * 
 * @canUse hideHomeButton
 * @null_implementation
 */
export const hideHomeButton = () => Promise.resolve()