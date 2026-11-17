import { navigateTo, redirectTo } from '../src/api'
import { history, setHistoryMode } from '../src/history'
import { RouterConfig } from '../src/router'

import type { MpaRouterConfig } from '../types/router'

type MpaHistory = typeof history & {
  parseUrl: (to: Parameters<typeof history.push>[0]) => string
}

describe('multi router history', () => {
  let mpaHistory: MpaHistory

  beforeEach(() => {
    RouterConfig.config = {
      pages: ['pages/index/index', 'pages/login/index'],
      router: { mode: 'multi', basename: '/', pathname: '/' },
    } as unknown as MpaRouterConfig
    setHistoryMode('multi', '/')
    mpaHistory = history as MpaHistory
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('parseUrl', () => {
    it('should append .html to page paths', () => {
      expect(mpaHistory.parseUrl({ pathname: '/pages/login/index' })).toBe('/pages/login/index.html')
    })

    it('should not append .html to paths that are not pages', () => {
      expect(mpaHistory.parseUrl({ pathname: '/about' })).toBe('/about')
    })

    it('should keep a single ? when search already starts with ?', () => {
      expect(mpaHistory.parseUrl({ pathname: '/pages/login/index', search: '?a=1&b=2' }))
        .toBe('/pages/login/index.html?a=1&b=2')
    })

    it('should prepend ? when search does not start with ?', () => {
      expect(mpaHistory.parseUrl({ pathname: '/pages/login/index', search: 'a=1' }))
        .toBe('/pages/login/index.html?a=1')
    })

    it('should keep a single # whether or not hash starts with #', () => {
      expect(mpaHistory.parseUrl({ pathname: '/pages/login/index', search: '?a=1', hash: '#top' }))
        .toBe('/pages/login/index.html?a=1#top')
      expect(mpaHistory.parseUrl({ pathname: '/pages/login/index', hash: 'top' }))
        .toBe('/pages/login/index.html#top')
    })

    it('should drop an empty search or hash', () => {
      expect(mpaHistory.parseUrl({ pathname: '/pages/login/index', search: '?', hash: '#' }))
        .toBe('/pages/login/index.html')
    })
  })

  it('should navigate to the page url with a single ? when calling navigateTo', () => {
    let url = ''
    jest.spyOn(mpaHistory, 'push').mockImplementation((to) => { url = mpaHistory.parseUrl(to) })

    navigateTo({ url: '/pages/login/index?a=1' })
    expect(url).toBe('/pages/login/index.html?a=1')
  })

  it('should redirect to the page url with a single ? when calling redirectTo', () => {
    let url = ''
    jest.spyOn(mpaHistory, 'replace').mockImplementation((to) => { url = mpaHistory.parseUrl(to) })

    redirectTo({ url: '/pages/login/index?a=1#top' })
    expect(url).toBe('/pages/login/index.html?a=1#top')
  })
})
