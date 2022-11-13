/* eslint-disable dot-notation */
import {
  AppInstance,
  createPageConfig, Current,
  eventCenter, hooks,
  stringify
} from '@tarojs/runtime'
import { Action as LocationAction, Listener as LocationListener } from 'history'
import UniversalRouter, { Routes } from 'universal-router'

import { history, prependBasename } from '../history'
import { addLeadingSlash, routesAlias, stripBasename, stripTrailing } from '../utils'
import { setTitle } from '../utils/navigate'
import { RouterConfig } from '.'
import PageHandler from './page'
import stacks from './stack'

import type { SpaRouterConfig } from '../../types/router'

export function createRouter (
  app: AppInstance,
  config: SpaRouterConfig,
  framework?: string
) {
  RouterConfig.config = config
  const handler = new PageHandler(config)

  routesAlias.set(handler.router.customRoutes)
  const basename = handler.router.basename
  const routes: Routes = handler.routes.map(route => {
    const routePath = addLeadingSlash(route.path)
    const paths = routesAlias.getAll(routePath)
    return {
      path: paths.length < 1 ? routePath : paths,
      action: route.load
    }
  })
  const router = new UniversalRouter(routes, { baseUrl: basename || '' })
  const launchParam: Taro.getLaunchOptionsSync.LaunchOptions = {
    path: handler.homePage,
    query: handler.getQuery(stacks.length),
    scene: 0,
    shareTicket: '',
    referrerInfo: {}
  }

  eventCenter.trigger('__taroRouterLaunch', launchParam)
  app.onLaunch?.(launchParam as Record<string, any>)
  app.onError && window.addEventListener('error', e => app.onError?.(e.message))

  const render: LocationListener = async ({ location, action }) => {
    handler.pathname = decodeURI(location.pathname)
    eventCenter.trigger('__taroRouterChange', {
      toLocation: {
        path: handler.pathname
      }
    })

    let element, params
    try {
      const result = await router.resolve(handler.router.forcePath || handler.pathname)
      ;[element, , params] = await Promise.all(result)
    } catch (error) {
      if (error.status === 404) {
        app.onPageNotFound?.({
          path: handler.pathname
        })
      } else if (/Loading hot update .* failed./.test(error.message)) {
        // NOTE: webpack5 与 prebundle 搭配使用时，开发环境下初次启动时偶发错误，由于 HMR 加载 chunk hash 错误，导致热更新失败
        window.location.reload()
      } else {
        throw new Error(error)
      }
    }
    if (!element) return
    const pageConfig = handler.pageConfig
    let enablePullDownRefresh = config?.window?.enablePullDownRefresh || false

    if (pageConfig) {
      document.title = pageConfig.navigationBarTitleText ?? document.title
      setTitle(pageConfig.navigationBarTitleText ?? document.title)
      if (typeof pageConfig.enablePullDownRefresh === 'boolean') {
        enablePullDownRefresh = pageConfig.enablePullDownRefresh
      }
    }

    const currentPage = Current.page
    const pathname = handler.pathname
    const methodName = stacks.method ?? ''
    let shouldLoad = false
    // 拷贝之后清空掉，因为浏览器左上角的返回前进不会有methodName
    stacks.method = ''

    if (action === 'POP') { // navigateBack
      // NOTE: 浏览器事件退后多次时，该事件只会被触发一次
      const prevIndex = stacks.getPrevIndex(pathname)
      const delta = stacks.getDelta(pathname)
      // NOTE: Safari 内核浏览器在非应用页面返回上一页时，会触发额外的 POP 事件，此处需避免当前页面被错误卸载
      if (currentPage !== stacks.getItem(prevIndex)) {
        // 卸载delta个页面
        handler.unload(currentPage, delta, prevIndex > -1)
        if (prevIndex > -1) {
          // 显示目标页
          return handler.show(stacks.getItem(prevIndex), pageConfig, prevIndex)
        }
        // 如果路由栈为空，则加载目标页
        shouldLoad = true
      }
    } else if (action === 'REPLACE') { // reLaunch switchTab redirectTo
      if (methodName === 'reLaunch') {
        // 卸载所有页面
        handler.unload(currentPage, stacks.length)
        // 加载目标页
        shouldLoad = true
      } else if (methodName === 'redirectTo') {
        const prevIndex = stacks.getPrevIndex(pathname)
        // 如果目标页是tabbar并且目标页已经存在了
        if (handler.isTabBar && prevIndex > -1) {
          const delta = stacks.getDelta(pathname)
          // delta + 1 是因为redirectTo的原则是先卸载再装载，所以也要把目标页先卸载，即卸载delta+1个页面
          handler.unload(currentPage, delta + 1)
          // 加载目标页
          shouldLoad = true
        } else {
          // 卸载当前页
          handler.unload(currentPage)
          // 加载目标页
          shouldLoad = true
        }
      } else if (methodName === 'switchTab') {
        // 如果目标页是tabbar
        if (handler.isTabBar) {
          // 如果当前页和目标页相同，则什么都不做
          if (handler.isSamePage(currentPage)) return
          const currentIsTab = handler.tabBarList?.some(t => stripTrailing(t.pagePath) === stripTrailing(currentPage.path))
          const prevIndex = stacks.getPrevIndex(pathname, 0)
          // 如果当前页是tabbar
          if (currentIsTab) {
            // 目标页是tabbar，当前页是tabbar，隐藏当前页
            handler.hide(currentPage)
            if (prevIndex > -1) {
              // 目标页是tabbar，当前页是tabbar，并且目标页存在，显示目标页
              return handler.show(stacks.getItem(prevIndex), pageConfig, prevIndex)
            }
            // 目标页是tabbar，当前页是tabbar，并且目标页不存在，加载目标页
            shouldLoad = true
          } else {
            if (prevIndex > -1) {
              const delta = stacks.getDelta(pathname)
              // 目标页是tabbar，当前页不是tabbar，目标页存在，卸载目标页后的页面
              handler.unload(currentPage, delta, prevIndex > -1)
              // 目标页是tabbar，当前页不是tabbar，目标页存在，显示目标页
              handler.show(stacks.getItem(prevIndex), pageConfig, prevIndex)
            } else {
              // 目标页是tabbar，当前页不是tabbar，目标页不存在，卸载所有的页面
              handler.unload(currentPage, stacks.length)
              // 目标页是tabbar，当前页不是tabbar，目标页不存在，加载目标页
              shouldLoad = true
            }
          }
        } else {
          return console.error('switchTab:fail can not switch to no-tabBar page')
        }
      } else {
        const delta = stacks.getDelta(pathname)
        handler.unload(currentPage, delta)
        shouldLoad = true
      }
    } else if (action === 'PUSH') { // navigateTo
      if (handler.isTabBar) {
        // 如果当前页和目标页相同，则什么都不做
        if (handler.isSamePage(currentPage)) return
        const prevIndex = stacks.getPrevIndex(pathname, 0)
        // 隐藏当前页面
        handler.hide(currentPage)
        if (prevIndex > -1) {
          // 如果tabbar目标页存在，则直接复用
          return handler.show(stacks.getItem(prevIndex), pageConfig, prevIndex)
        }
        // 重新加载新页面
        shouldLoad = true
      } else {
        // 隐藏当前页面，加载新页面
        handler.hide(currentPage)
        shouldLoad = true
      }
    }



    if (shouldLoad || stacks.length < 1) {
      const el = element.default ?? element
      const loadConfig = { ...pageConfig }
      const stacksIndex = stacks.length
      delete loadConfig['path']
      delete loadConfig['load']

      const page = createPageConfig(
        enablePullDownRefresh ? hooks.call('createPullDownComponent', el, location.pathname, framework, handler.PullDownRefresh) : el,
        pathname + stringify(handler.getQuery(stacksIndex)),
        {},
        loadConfig
      )
      if (params) page.options = params
      return handler.load(page, pageConfig, stacksIndex)
    }
  }

  const routePath = addLeadingSlash(stripBasename(history.location.pathname, handler.basename))
  if (routePath === '/') {
    history.replace(prependBasename(handler.homePage + history.location.search))
  }

  render({ location: history.location, action: LocationAction.Push })

  app.onShow?.(launchParam as Record<string, any>)

  return history.listen(render)
}
