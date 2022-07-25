/* eslint-disable dot-notation */
import {
  AppInstance,
  createPageConfig, Current,
  eventCenter, hooks,
  stringify
} from '@tarojs/runtime'
import { setTitle } from '@tarojs/taro-h5/dist/utils/navigate'
import { Action as LocationAction, Listener as LocationListener } from 'history'
import UniversalRouter, { Routes } from 'universal-router'

import type { SpaRouterConfig } from '../../types/router'
import { history, prependBasename } from '../history'
import { addLeadingSlash, routesAlias, stripBasename } from '../utils'
import { RouterConfig } from '.'
import PageHandler from './page'
import stacks from './stack'

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
  const launchParam = handler.getQuery(stacks.length)
  app.onLaunch?.(launchParam)
  app.onError && window.addEventListener('error', e => app.onError?.(e.message))

  const render: LocationListener = async ({ location, action }) => {
    handler.pathname = decodeURI(location.pathname)
    let element, params
    try {
      const result = await router.resolve(handler.router.forcePath || handler.pathname)
      ;[element, , params] = await Promise.all(result)
    } catch (error) {
      if (error.status === 404) {
        app.onPageNotFound?.({
          path: handler.pathname
        })
      } else {
        throw new Error(error)
      }
    }
    if (!element) return
    const pageConfig = handler.pageConfig
    let enablePullDownRefresh = config?.window?.enablePullDownRefresh || false

    eventCenter.trigger('__taroRouterChange', {
      toLocation: {
        path: handler.pathname
      }
    })

    if (pageConfig) {
      document.title = pageConfig.navigationBarTitleText ?? document.title
      setTitle(pageConfig.navigationBarTitleText ?? document.title)
      if (typeof pageConfig.enablePullDownRefresh === 'boolean') {
        enablePullDownRefresh = pageConfig.enablePullDownRefresh
      }
    }

    const currentPage = Current.page
    const pathname = handler.pathname
    let shouldLoad = false

    if (action === 'POP') {
      // NOTE: 浏览器事件退后多次时，该事件只会被触发一次
      const prevIndex = stacks.getPrevIndex(pathname)
      const delta = stacks.getDelta(pathname)
      // NOTE: Safari 内核浏览器在非应用页面返回上一页时，会触发额外的 POP 事件，此处需避免当前页面被错误卸载
      if (currentPage !== stacks.getItem(prevIndex)) {
        handler.unload(currentPage, delta, prevIndex > -1)
        if (prevIndex > -1) {
          handler.show(stacks.getItem(prevIndex), pageConfig, prevIndex)
        } else {
          shouldLoad = true
        }
      }
    } else {
      if (handler.isTabBar) {
        if (handler.isSamePage(currentPage)) return
        const prevIndex = stacks.getPrevIndex(pathname, 0)
        handler.hide(currentPage)
        if (prevIndex > -1) {
          // NOTE: tabbar 页且之前出现过，直接复用
          return handler.show(stacks.getItem(prevIndex), pageConfig, prevIndex)
        }
      } else if (action === 'REPLACE') {
        const delta = stacks.getDelta(pathname)
        // NOTE: 页面路由记录并不会清空，只是移除掉缓存的 stack 以及页面
        handler.unload(currentPage, delta)
      } else if (action === 'PUSH') {
        handler.hide(currentPage)
      }
      shouldLoad = true
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

  const routePath = stripBasename(history.location.pathname, handler.basename)
  if (routePath === '/' || routePath === '') {
    history.replace(prependBasename(handler.homePage + history.location.search))
  }

  render({ location: history.location, action: LocationAction.Push })

  app.onShow?.(launchParam)

  return history.listen(render)
}
