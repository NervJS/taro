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

      hideNavigationBarHomeButton()

      expect(getFnBtn()).toBe('none')
    })

    it('keeps the home button hidden when called before the page is loaded', () => {
      setStackSize(1)
      const handler = createHandler(OTHER_PAGE)

      // 页面在 onShow 中调用时，导航栏还未根据当前页面刷新
      hideNavigationBarHomeButton()
      handler.load()

      expect(getFnBtn()).toBe('none')
    })

    it('does not hide the back button', () => {
      setStackSize(2)
      const handler = createHandler(OTHER_PAGE)
      handler.load()

      hideNavigationBarHomeButton()

      expect(getFnBtn()).toBe('back')
    })

    it('only applies to the page instance that hid it', () => {
      setStackSize(1)
      const handler = createHandler(OTHER_PAGE)
      handler.load()
      hideNavigationBarHomeButton()
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
      hideNavigationBarHomeButton()

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
      hideNavigationBarHomeButton()
      expect(getFnBtn()).toBe('none')

      // 例如 reLaunch 到同一路由：旧实例出栈，新实例入栈且没有调用该接口
      setStackSize(1)
      handler.load()

      expect(getFnBtn()).toBe('home')
    })
  })

  describe('hideHomeButton with the page handler', () => {
    function createPage (path: string) {
      return {
        path,
        options: {},
        $taroParams: { stamp: 'navigation-bar-test' },
        onShow: jest.fn(),
        onHide: jest.fn(),
        onUnload: jest.fn()
      } as unknown as PageInstance
    }

    function createContainer (page: PageInstance) {
      const el = document.createElement('div')
      el.id = page.path!
      el.className = 'taro_page'
      document.body.appendChild(el)
      return el
    }

    function createPageHandler (pathname: string) {
      const config: SpaRouterConfig = {
        pages: ['pages/index/index', 'pages/detail/index', 'pages/another/index'],
        routes: [{ path: '/pages/index/index' }, { path: OTHER_PAGE }, { path: '/pages/another/index' }],
        router: { mode: 'browser', basename: '', pathname },
        window: { navigationStyle: 'default' }
      }
      return new PageHandler(config, createBrowserHistory())
    }

    // PageHandler 通过运行时的 location 获取当前路由，这里直接模拟路由切换
    let route = OTHER_PAGE
    const setRoute = (pathname: string) => {
      route = pathname
    }

    afterEach(() => {
      route = OTHER_PAGE
      document.body.innerHTML = ''
    })

    it('stays hidden after navigateTo and navigateBack, and resets on a relaunched instance', () => {
      const handler = createPageHandler(OTHER_PAGE)
      jest.spyOn(handler, 'currentPage', 'get').mockImplementation(() => route)
      const page = createPage(OTHER_PAGE)
      createContainer(page)
      // 页面在 onShow 中调用，此时路由还未刷新导航栏
      ;(page.onShow as jest.Mock).mockImplementationOnce(() => hideNavigationBarHomeButton())

      handler.load(page, {}, 'navigation-bar-test')
      expect(getFnBtn()).toBe('none')

      // navigateTo 另一个页面
      const nextPage = createPage('/pages/another/index')
      createContainer(nextPage)
      handler.hide(page)
      setRoute('/pages/another/index')
      handler.load(nextPage, {}, 'navigation-bar-test')
      expect(getFnBtn()).toBe('back')

      // navigateBack 回到原页面
      handler.unload(nextPage)
      setRoute(OTHER_PAGE)
      handler.show(page)
      expect(getFnBtn()).toBe('none')

      // reLaunch 到同一路由的新实例，且没有调用该接口
      handler.unload(page)
      setRoute(OTHER_PAGE)
      const relaunched = createPage(OTHER_PAGE)
      createContainer(relaunched)
      handler.load(relaunched, {}, 'navigation-bar-test')
      expect(getFnBtn()).toBe('home')
    })
  })

  describe('hideHomeButton called while a page is unloading', () => {
    it('does not hide the home button of the page navigated back to', () => {
      const config: SpaRouterConfig = {
        pages: ['pages/index/index', 'pages/detail/index', 'pages/another/index'],
        routes: [{ path: '/pages/index/index' }, { path: OTHER_PAGE }, { path: '/pages/another/index' }],
        router: { mode: 'browser', basename: '', pathname: OTHER_PAGE },
        window: { navigationStyle: 'default' }
      }
      const handler = new PageHandler(config, createBrowserHistory())
      let route = OTHER_PAGE
      jest.spyOn(handler, 'currentPage', 'get').mockImplementation(() => route)
      const create = (path: string, onUnload?: () => void) => {
        const el = document.createElement('div')
        el.id = path
        el.className = 'taro_page'
        document.body.appendChild(el)
        return {
          path,
          options: {},
          $taroParams: { stamp: 'navigation-bar-test' },
          onShow: jest.fn(),
          onHide: jest.fn(),
          onUnload: jest.fn(onUnload)
        } as unknown as PageInstance
      }

      const pageA = create(OTHER_PAGE)
      handler.load(pageA, {}, 'navigation-bar-test')
      expect(getFnBtn()).toBe('home')

      // B 在 onUnload 中调用该接口，此时 B 已出栈，栈顶是 A
      const pageB = create('/pages/another/index', () => hideNavigationBarHomeButton())
      handler.hide(pageA)
      route = '/pages/another/index'
      handler.load(pageB, {}, 'navigation-bar-test')
      handler.unload(pageB)
      route = OTHER_PAGE
      handler.show(pageA)

      expect(pageB.onUnload).toHaveBeenCalledTimes(1)
      expect(getFnBtn()).toBe('home')
      document.body.innerHTML = ''
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
