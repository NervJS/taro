import { Current, createPageConfig, document as taroDocument, injectPageInstance } from '@tarojs/runtime'
import { createBrowserHistory } from 'history'

import NavigationBarHandler from '../src/router/navigation-bar'
import PageHandler from '../src/router/page'
import stacks from '../src/router/stack'
import { hideNavigationBarHomeButton } from '../src/utils/navigate'

import type { PageInstance } from '@tarojs/runtime'
import type { SpaRouterConfig } from '../types/router'

const HOME_PAGE = '/pages/index/index'
const OTHER_PAGE = '/pages/detail/index'
const TAB_PAGE = '/pages/tab/index'

function createHandler (currentPage: string, options: {
  windowNavigationStyle?: string
  pageNavigationStyle?: string
} = {}) {
  return new NavigationBarHandler({
    config: { window: { navigationStyle: options.windowNavigationStyle } },
    currentPage,
    homePage: HOME_PAGE,
    isTabBar: (pathname: string) => pathname === TAB_PAGE,
    originHomePage: HOME_PAGE,
    originPathname: currentPage,
    pageConfig: { navigationStyle: options.pageNavigationStyle },
  } as unknown as PageHandler)
}

// 页面的生命周期执行时，Current.page 指向该页面
function hideAsCurrentPage () {
  Current.page = stacks.last as any
  hideNavigationBarHomeButton()
}

function setStackSize (size: number) {
  while (stacks.length > 0) stacks.pop()
  for (let i = 0; i < size; i++) stacks.push({} as PageInstance)
}

describe('NavigationBarHandler', () => {
  let navigationBar: HTMLElement

  beforeEach(() => {
    navigationBar = document.createElement('div')
    navigationBar.id = 'taro-navigation-bar'
    document.body.appendChild(navigationBar)
  })

  afterEach(() => {
    navigationBar.remove()
    setStackSize(0)
  })

  const getFnBtn = () => {
    if (navigationBar.classList.contains('taro-navigation-bar-back-icon')) return 'back'
    if (navigationBar.classList.contains('taro-navigation-bar-home-icon')) return 'home'
    return 'none'
  }

  describe('setFnBtnState', () => {
    it.each([
      ['the home page opened as the only page', HOME_PAGE, 1, 'none'],
      ['the home page navigated to from another page', HOME_PAGE, 2, 'back'],
      ['a tabBar page opened as the only page', TAB_PAGE, 1, 'none'],
      ['a tabBar page above other pages', TAB_PAGE, 2, 'none'],
      ['another page opened as the only page', OTHER_PAGE, 1, 'home'],
      ['another page above other pages', OTHER_PAGE, 2, 'back'],
    ])('shows the right button on %s', (_, currentPage, stackSize, expected) => {
      setStackSize(stackSize)

      createHandler(currentPage).setFnBtnState()

      expect(getFnBtn()).toBe(expected)
    })

    it('removes the back button after going back to the home page', () => {
      const handler = createHandler(HOME_PAGE)

      setStackSize(2)
      handler.setFnBtnState()
      expect(getFnBtn()).toBe('back')

      setStackSize(1)
      handler.setFnBtnState()
      expect(getFnBtn()).toBe('none')
    })
  })

  describe('hideHomeButton', () => {
    it('hides the home button of the current page', () => {
      setStackSize(1)
      const handler = createHandler(OTHER_PAGE)
      handler.load()
      expect(getFnBtn()).toBe('home')

      hideAsCurrentPage()

      expect(getFnBtn()).toBe('none')
    })

    it('keeps the home button hidden when called before the page is loaded', () => {
      setStackSize(1)
      const handler = createHandler(OTHER_PAGE)

      // 页面在 onShow 中调用时，导航栏还未根据当前页面刷新
      hideAsCurrentPage()
      handler.load()

      expect(getFnBtn()).toBe('none')
    })

    it('does not hide the back button', () => {
      setStackSize(2)
      const handler = createHandler(OTHER_PAGE)
      handler.load()

      hideAsCurrentPage()

      expect(getFnBtn()).toBe('back')
    })

    it('only applies to the page instance that hid it', () => {
      setStackSize(1)
      const handler = createHandler(OTHER_PAGE)
      handler.load()
      hideAsCurrentPage()
      expect(getFnBtn()).toBe('none')

      const anotherPage = '/pages/another/index'
      setStackSize(1)
      Object.assign(handler.pageContext, { currentPage: anotherPage, originPathname: anotherPage })
      handler.load()
      expect(getFnBtn()).toBe('home')
    })

    it('stays hidden after navigating to another page and back', () => {
      setStackSize(1)
      const handler = createHandler(OTHER_PAGE)
      handler.load()
      hideAsCurrentPage()

      const anotherPage = '/pages/another/index'
      const original = stacks.last
      stacks.push({} as PageInstance)
      Object.assign(handler.pageContext, { currentPage: anotherPage, originPathname: anotherPage })
      handler.load()
      expect(getFnBtn()).toBe('back')

      stacks.pop()
      expect(stacks.last).toBe(original)
      Object.assign(handler.pageContext, { currentPage: OTHER_PAGE, originPathname: OTHER_PAGE })
      handler.load()
      expect(getFnBtn()).toBe('none')
    })

    it('does not carry over to a new instance of the same route', () => {
      setStackSize(1)
      const handler = createHandler(OTHER_PAGE)
      handler.load()
      hideAsCurrentPage()
      expect(getFnBtn()).toBe('none')

      // 例如 reLaunch 到同一路由：旧实例出栈，新实例入栈且没有调用该接口
      setStackSize(1)
      handler.load()

      expect(getFnBtn()).toBe('home')
    })
  })

  describe('hideHomeButton with the real page config', () => {
    const ANOTHER_PAGE = '/pages/another/index'
    const STAMP = 'navigation-bar-test'

    type Lifecycles = Partial<Record<'onShow' | 'onUnload', () => void>>

    let route = OTHER_PAGE
    let handler: PageHandler

    // 与 connect 一致：挂载页面时创建页面容器并注册页面实例，用户生命周期通过 safeExecute 在 hasLoaded 之后执行
    function createPage (path: string, lifecycles: Lifecycles = {}) {
      const component = { onShow: jest.fn(lifecycles.onShow), onUnload: jest.fn(lifecycles.onUnload) }
      Current.app = {
        mount: (_component, $taroPath, cb) => {
          const el = document.createElement('div')
          el.id = $taroPath
          el.className = 'taro_page'
          document.body.appendChild(el)
          const root = taroDocument.createElement('root')
          root.id = $taroPath
          taroDocument.body.appendChild(root)
          injectPageInstance(component as any, $taroPath)
          cb()
        },
        unmount: (_$taroPath, cb) => cb()
      } as any
      const page = createPageConfig(component, path, {}, {}) as unknown as PageInstance
      page.options = { stamp: STAMP }
      return { page, component }
    }

    function load (page: PageInstance, path: string) {
      route = path
      handler.load(page, {}, STAMP)
    }

    function back (from: PageInstance, to: PageInstance, path: string) {
      handler.unload(from, 1)
      route = path
      handler.show(to)
    }

    // 用户的 onShow 在 Promise 回调中执行，需要等待微任务
    const flush = async () => {
      for (let i = 0; i < 5; i++) await Promise.resolve()
    }

    // H5 端页面路径会写入页面配置，同时页面挂载后同步执行回调
    const platform = process.env.TARO_PLATFORM
    beforeAll(() => {
      process.env.TARO_PLATFORM = 'web'
    })

    afterAll(() => {
      process.env.TARO_PLATFORM = platform
    })

    beforeEach(() => {
      route = OTHER_PAGE
      const config: SpaRouterConfig = {
        pages: ['pages/index/index', 'pages/detail/index', 'pages/another/index'],
        routes: [{ path: HOME_PAGE }, { path: OTHER_PAGE }, { path: ANOTHER_PAGE }],
        router: { mode: 'browser', basename: '', pathname: OTHER_PAGE },
        window: { navigationStyle: 'default' }
      }
      handler = new PageHandler(config, createBrowserHistory())
      jest.spyOn(handler, 'currentPage', 'get').mockImplementation(() => route)
    })

    afterEach(() => {
      jest.useRealTimers()
      Current.page = null
      document.body.innerHTML = ''
    })

    it('stays hidden after navigateTo and navigateBack, and resets on a relaunched instance', async () => {
      const { page: pageA, component: a } = createPage(OTHER_PAGE)
      // 只在第一次 onShow 中调用
      a.onShow.mockImplementationOnce(() => hideNavigationBarHomeButton())
      load(pageA, OTHER_PAGE)
      await flush()
      expect(getFnBtn()).toBe('none')

      const { page: pageB } = createPage(ANOTHER_PAGE)
      handler.hide(pageA)
      load(pageB, ANOTHER_PAGE)
      await flush()
      expect(getFnBtn()).toBe('back')

      back(pageB, pageA, OTHER_PAGE)
      await flush()
      expect(a.onShow).toHaveBeenCalledTimes(2)
      expect(getFnBtn()).toBe('none')

      // reLaunch 到同一路由的新实例，且没有调用该接口
      handler.unload(pageA)
      const { page: relaunched } = createPage(OTHER_PAGE)
      load(relaunched, OTHER_PAGE)
      await flush()
      expect(getFnBtn()).toBe('home')
    })

    describe.each([
      ['without animation', false],
      ['with animation', true]
    ])('on the page navigated back to %s', (_name, animated) => {
      async function openAThenB (lifecyclesB: Lifecycles = {}, lifecyclesA: Lifecycles = {}) {
        const a = createPage(OTHER_PAGE, lifecyclesA)
        load(a.page, OTHER_PAGE)
        await flush()
        expect(getFnBtn()).toBe('home')

        const b = createPage(ANOTHER_PAGE, lifecyclesB)
        handler.hide(a.page)
        load(b.page, ANOTHER_PAGE)
        await flush()
        return { a, b }
      }

      // 带动画时页面在动画结束后才卸载，之后再展示目标页面
      async function goBack (from: PageInstance, to: PageInstance) {
        if (animated) {
          jest.useFakeTimers()
          handler.unload(from, 1, true)
          await jest.advanceTimersByTimeAsync(handler.animationDuration)
          route = OTHER_PAGE
          handler.show(to)
        } else {
          back(from, to, OTHER_PAGE)
        }
        await flush()
      }

      it('does not hide the home button when the popped page calls it synchronously in onUnload', async () => {
        const { a, b } = await openAThenB({ onUnload: () => hideNavigationBarHomeButton() })

        await goBack(b.page, a.page)

        expect(b.component.onUnload).toHaveBeenCalledTimes(1)
        expect(getFnBtn()).toBe('home')
      })

      it('does not hide the home button when the popped page calls it from a microtask in onUnload', async () => {
        let deferred: Promise<void> = Promise.resolve()
        const { a, b } = await openAThenB({
          onUnload: () => {
            deferred = Promise.resolve().then(() => hideNavigationBarHomeButton())
          }
        })

        await goBack(b.page, a.page)
        await deferred

        expect(b.component.onUnload).toHaveBeenCalledTimes(1)
        expect(getFnBtn()).toBe('home')
      })

      it('applies a call made in onShow when the page is shown again', async () => {
        const { a, b } = await openAThenB()
        // 只在返回后的第二次 onShow 中调用
        a.component.onShow.mockImplementationOnce(() => hideNavigationBarHomeButton())

        await goBack(b.page, a.page)

        expect(a.component.onShow).toHaveBeenCalledTimes(2)
        expect(getFnBtn()).toBe('none')
      })
    })

    it('applies a call made in onShow of a page opened by reLaunch', async () => {
      const { page: pageA } = createPage(OTHER_PAGE)
      load(pageA, OTHER_PAGE)
      await flush()
      expect(getFnBtn()).toBe('home')

      handler.unload(pageA)
      const { page: relaunched } = createPage(ANOTHER_PAGE, { onShow: () => hideNavigationBarHomeButton() })
      load(relaunched, ANOTHER_PAGE)
      await flush()

      expect(getFnBtn()).toBe('none')
    })
  })

  describe('setNavigationBarVisible', () => {
    const isVisible = () => {
      const show = navigationBar.classList.contains('taro-navigation-bar-show')
      expect(navigationBar.classList.contains('taro-navigation-bar-hide')).toBe(!show)
      return show
    }

    it('follows an explicit boolean regardless of the navigation style', () => {
      const handler = createHandler(HOME_PAGE, { windowNavigationStyle: 'custom' })
      handler.setNavigationBarVisible(true)
      expect(isVisible()).toBe(true)

      const defaultStyleHandler = createHandler(HOME_PAGE, { windowNavigationStyle: 'default' })
      defaultStyleHandler.setNavigationBarVisible(false)
      expect(isVisible()).toBe(false)
    })

    it.each([
      [undefined, undefined, false],
      ['default', undefined, true],
      ['custom', undefined, false],
      ['default', 'custom', false],
      ['custom', 'default', true],
    ])('falls back to window style %s and page style %s', (windowNavigationStyle, pageNavigationStyle, expected) => {
      createHandler(HOME_PAGE, { windowNavigationStyle, pageNavigationStyle }).setNavigationBarVisible()

      expect(isVisible()).toBe(expected)
    })
  })
})
