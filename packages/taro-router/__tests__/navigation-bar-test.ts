import NavigationBarHandler from '../src/router/navigation-bar'
import stacks from '../src/router/stack'
import { hideNavigationBarHomeButton } from '../src/utils/navigate'

import type { PageInstance } from '@tarojs/runtime'
import type PageHandler from '../src/router/page'

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

    it('only applies to the page that hid it', () => {
      setStackSize(1)
      const handler = createHandler(OTHER_PAGE)
      handler.load()
      hideNavigationBarHomeButton()
      expect(getFnBtn()).toBe('none')

      const anotherPage = '/pages/another/index'
      Object.assign(handler.pageContext, { currentPage: anotherPage, originPathname: anotherPage })
      handler.load()
      expect(getFnBtn()).toBe('home')

      Object.assign(handler.pageContext, { currentPage: OTHER_PAGE, originPathname: OTHER_PAGE })
      handler.load()
      expect(getFnBtn()).toBe('none')
    })

    it('stays hidden after navigating to another page and back', () => {
      setStackSize(1)
      const handler = createHandler(OTHER_PAGE)
      handler.load()
      hideNavigationBarHomeButton()

      const anotherPage = '/pages/another/index'
      setStackSize(2)
      Object.assign(handler.pageContext, { currentPage: anotherPage, originPathname: anotherPage })
      handler.load()
      expect(getFnBtn()).toBe('back')

      setStackSize(1)
      Object.assign(handler.pageContext, { currentPage: OTHER_PAGE, originPathname: OTHER_PAGE })
      handler.load()
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
