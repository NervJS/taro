import { History } from '../src/utils/types'
import createHistory from '../src/history/createHashHistory'
import { createNavigateTo, createNavigateBack, createRedirectTo } from '../src/apis'

let history: History

beforeEach(() => {
  history = createHistory()
})

xdescribe('navigateTo/navigateBack/redirectTo', () => {
  const location1 = {
    pathname: '/',
    state: { key: '0' },
    search: '',
    hash: '',
    params: {}
  }

  const url2 = '/pages/about/index?para=1'
  const location2 = {
    pathname: '/pages/about/index',
    state: { key: '1' },
    search: '?para=1',
    hash: '',
    params: {
      para: '1'
    }
  }

  const url3 = '/pages/settings/index?para2=2'
  const location3 = {
    pathname: '/pages/settings/index',
    state: { key: '1' },
    search: '?para2=2',
    hash: '',
    params: {
      para2: '2'
    }
  }

  it('should be able to navigate to third-party websites', () => {
    const thirdPartyWebsite = 'https://www.baidu.com'
    const navigateTo = createNavigateTo(history)
    
    const spy = jest.spyOn(window.location, 'assign').mockImplementation(() => {})
    navigateTo({ url: thirdPartyWebsite })
    expect(spy).toHaveBeenCalledWith(thirdPartyWebsite)
    spy.mockClear()
  })

  it('should notify listeners with proper params when calling navigateTo', () => {
    const navigateTo = createNavigateTo(history)

    const mockListener = jest.fn()
    history.listen(mockListener)

    navigateTo({ url: url2 })
    expect(mockListener).toHaveBeenCalledWith({ fromLocation: location1, toLocation: location2, action: 'PUSH' })
  })

  it('should notify listeners with proper params when calling navigateBack', () => {
    const navigateBack = createNavigateBack(history)

    // jsdom无法准确模拟history的全部功能，这里使用spy代替
    const spy = spyOn(window.history, 'go')
    navigateBack({ delta: 1 })
    expect(spy).toHaveBeenCalledWith(1)
  })

  it('should notify listeners with proper params when calling redirectTo', () => {
    const redirectTo = createRedirectTo(history)

    const mockListener = jest.fn()
    history.listen(mockListener)

    redirectTo({ url: url3 })
    expect(mockListener).toHaveBeenCalledWith({ fromLocation: location2, toLocation: location3, action: 'REPLACE' })
  })
})
