describe('location', () => {
  const runtime = require('../../dist/runtime.esm')

  it('parseUrl', () => {
    const parseUrl = runtime.parseUrl

    // full url
    {
      const { href, origin, protocol, hostname, host, port, pathname, search, hash } = parseUrl(
        'https://taro.com:8080/hello/world?name=hongxin&age=18#a=1&b=2'
      )
      expect(href).toBe('https://taro.com:8080/hello/world?name=hongxin&age=18#a=1&b=2')
      expect(origin).toBe('https://taro.com')
      expect(protocol).toBe('https:')
      expect(hostname).toBe('taro.com')
      expect(host).toBe('taro.com:8080')
      expect(port).toBe('8080')
      expect(pathname).toBe('/hello/world')
      expect(search).toBe('?name=hongxin&age=18')
      expect(hash).toBe('#a=1&b=2')
    }

    {
      const { href, origin, protocol, hostname, host, port, pathname, search, hash } = parseUrl(
        'http://taro.com/hello/world#a=1&b=2?name=hongxin&age=18'
      )
      expect(href).toBe('http://taro.com/hello/world#a=1&b=2?name=hongxin&age=18')
      expect(origin).toBe('http://taro.com')
      expect(protocol).toBe('http:')
      expect(hostname).toBe('taro.com')
      expect(host).toBe('taro.com')
      expect(port).toBe('')
      expect(pathname).toBe('/hello/world')
      expect(search).toBe('')
      expect(hash).toBe('#a=1&b=2?name=hongxin&age=18')
    }

    // the url should be correct
    {
      const { href } = parseUrl('/a/b')
      expect(href).toBe('')
    }

    // pathname should be "/" if not exist in url
    {
      const { protocol, pathname, search } = parseUrl('//taro.com?a=1')
      expect(protocol).toBe('https:')
      expect(pathname).toBe('/')
      expect(search).toBe('?a=1')
    }
  })

  it('URLSearchParams', () => {
    const URLSearchParams = runtime.URLSearchParams

    // query is empty
    {
      const searchParams = new URLSearchParams('')
      expect(searchParams.keys()).toEqual([])
    }
    // constructor
    {
      const searchParams = new URLSearchParams('?a=1&b=2')
      expect(searchParams.keys()).toEqual(['a', 'b'])
      expect(searchParams.get('a')).toBe('1')
      expect(searchParams.get('b')).toBe('2')
    }
    {
      const searchParams = new URLSearchParams('a=1&b=2')
      expect(searchParams.keys()).toEqual(['a', 'b'])
      expect(searchParams.get('a')).toBe('1')
      expect(searchParams.get('b')).toBe('2')
    }
    {
      const searchParams = new URLSearchParams([
        ['a', '1'],
        ['b', '2'],
      ])
      expect(searchParams.keys()).toEqual(['a', 'b'])
      expect(searchParams.get('a')).toBe('1')
      expect(searchParams.get('b')).toBe('2')
    }
    {
      const searchParams = new URLSearchParams({ a: '1', b: '2' })
      expect(searchParams.keys()).toEqual(['a', 'b'])
      expect(searchParams.get('a')).toBe('1')
      expect(searchParams.get('b')).toBe('2')
    }

    // methods
    {
      const searchParams = new URLSearchParams({ a: '1' })
      expect(searchParams.get('a')).toBe('1')
      searchParams.set('b', '2')
      expect(searchParams.get('b')).toBe('2')
      expect(searchParams.has('b')).toBe(true)
      searchParams.delete('b')
      expect(searchParams.has('b')).toBe(false)
      searchParams.set('c', '3')
      expect(searchParams.toString()).toBe('a=1&c=3')
      searchParams.append('c', '4')
      expect(searchParams.toString()).toBe('a=1&c=3&c=4')
    }
    {
      const searchParams = new URLSearchParams('a=1&a=2')
      expect(searchParams.getAll('a')).toEqual(['1', '2'])
    }
  })

  it('URL', () => {
    const URL = runtime.URL

    // constructor
    try {
      // eslint-disable-next-line
      new URL()
    } catch (error) {
      expect(error instanceof TypeError).toBe(true)
      expect(error.message).toMatch('Invalid URL')
    }

    try {
      // eslint-disable-next-line
      new URL('//taro.com')
    } catch (error) {
      expect(error instanceof TypeError).toBe(true)
      expect(error.message).toMatch('Invalid URL')
    }

    try {
      // eslint-disable-next-line
      new URL('/a/b', '/c/d')
    } catch (error) {
      expect(error instanceof TypeError).toBe(true)
      expect(error.message).toMatch('Invalid base URL')
    }

    try {
      // eslint-disable-next-line
      new URL('http://taro.com', '')
    } catch (error) {
      expect(error instanceof TypeError).toBe(true)
      expect(error.message).toMatch('Invalid base URL')
    }

    {
      const url = new URL('http://taro.com')
      expect(url.toString()).toBe('http://taro.com/')
    }

    {
      const url = new URL('http://taro.com/')
      expect(url.toString()).toBe('http://taro.com/')
      expect(url.pathname).toBe('/')
    }

    {
      const url = new URL('?a=1#b=2', 'https://taro.com')
      expect(url.toString()).toBe('https://taro.com/?a=1#b=2')
    }

    // cases from https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
    {
      const baseUrl = 'https://developer.mozilla.org'
      const A = new URL('/', baseUrl)
      expect(A.toString()).toBe('https://developer.mozilla.org/')
      const B = new URL(baseUrl)
      expect(B.toString()).toBe('https://developer.mozilla.org/')
      const C = new URL('en-US/docs', B)
      expect(C.toString()).toBe('https://developer.mozilla.org/en-US/docs')
      const D = new URL('/en-US/docs', B)
      expect(D.toString()).toBe('https://developer.mozilla.org/en-US/docs')
      const E = new URL('/en-US/docs', D)
      expect(E.toString()).toBe('https://developer.mozilla.org/en-US/docs')
      const F = new URL('/en-US/docs', A)
      expect(F.toString()).toBe('https://developer.mozilla.org/en-US/docs')
      const G = new URL('/en-US/docs', 'https://developer.mozilla.org/fr-FR/toto')
      expect(G.toString()).toBe('https://developer.mozilla.org/en-US/docs')

      const H = new URL('', 'https://example.com/?query=1')
      expect(H.toString()).toBe('https://example.com/?query=1')
      const I = new URL('//foo.com', 'https://example.com')
      expect(I.toString()).toBe('https://foo.com/')
    }

    // searchParams
    {
      const url = new URL('http://taro.com/?a=1&b=2')
      url.searchParams.append('c', '3')
      expect(url.searchParams.keys()).toEqual(['a', 'b', 'c'])
      expect(url.searchParams.get('a')).toBe('1')
      expect(url.searchParams.get('b')).toBe('2')
      expect(url.searchParams.get('c')).toBe('3')
      url.searchParams.append('d', '4')
      expect(url.toString()).toBe('http://taro.com/?a=1&b=2&c=3&d=4')
    }

    // setters
    {
      const url = new URL('http://taro.com')
      expect(url.toString()).toBe('http://taro.com/')
      url.protocol = 'https:'
      expect(url.toString()).toBe('https://taro.com/')
      url.port = '8080'
      expect(url.toString()).toBe('https://taro.com:8080/')
      url.pathname = '/hello/world'
      expect(url.toString()).toBe('https://taro.com:8080/hello/world')
      url.hostname = 'example.com'
      expect(url.toString()).toBe('https://example.com:8080/hello/world')
      url.hostname = 'taro.com'
      expect(url.toString()).toBe('https://taro.com:8080/hello/world')
      url.search = '?a=1'
      expect(url.toString()).toBe('https://taro.com:8080/hello/world?a=1')
      url.hash = '#b=2'
      expect(url.toString()).toBe('https://taro.com:8080/hello/world?a=1#b=2')

      url.host = 'example.com:8081'
      expect(url.toString()).toBe('https://example.com:8081/hello/world?a=1#b=2')
      url.origin = 'http://taro.com:8080'
      expect(url.toString()).toBe('http://taro.com:8080/hello/world?a=1#b=2')
      url.href = 'https://taro.com/user?name=hongxin#age=18'
      expect(url.toString()).toBe('https://taro.com/user?name=hongxin#age=18')
      expect(url.search).toBe('?name=hongxin')
    }
  })

  it('Location', () => {
    const Location = runtime.Location
    const Current = runtime.Current
    const raw = JSON.stringify(Current)
    const fakerWindow = { trigger () {} }

    {
      Current.router = {
        path: '',
        params: { a: '1', b: '2' },
      }
      const location = new Location({ window: fakerWindow })
      expect(location.toString()).toBe('https://taro.com/?a=1&b=2')
      expect(location.protocol).toBe('https:')
      expect(location.host).toBe('taro.com')
      expect(location.port).toBe('')
      expect(location.pathname).toBe('/')
      expect(location.search).toBe('?a=1&b=2')
      expect(location.hash).toBe('')
    }

    {
      Current.router = {
        path: 'pages/index/index',
        params: { a: '1', b: '2' },
      }
      const location = new Location({ window: fakerWindow })
      expect(location.toString()).toBe('https://taro.com/pages/index/index?a=1&b=2')
      expect(location.protocol).toBe('https:')
      expect(location.host).toBe('taro.com')
      expect(location.port).toBe('')
      expect(location.pathname).toBe('/pages/index/index')
      expect(location.search).toBe('?a=1&b=2')
      expect(location.hash).toBe('')
      expect(location.hostname).toBe('taro.com')
      expect(location.origin).toBe('https://taro.com')
      expect(location.href).toBe('https://taro.com/pages/index/index?a=1&b=2')
    }

    // setters
    {
      Current.router = {
        path: '',
        params: { a: '1', b: '2' },
      }
      const location = new Location({ window: fakerWindow })
      expect(location.href).toBe('https://taro.com/?a=1&b=2')
      location.protocol = 'http:'
      expect(location.protocol).toBe('https:')
      location.hostname = 'hongxin.com'
      expect(location.hostname).toBe('taro.com')
      location.port = '8080'
      expect(location.port).toBe('')
      location.pathname = '/hello/world'
      expect(location.pathname).toBe('/hello/world')
      location.search = '?c=3&d=4'
      expect(location.search).toBe('?c=3&d=4')
      location.hash = '#e=5&f=6'
      expect(location.hash).toBe('#e=5&f=6')
      location.origin = 'http://hongxin.com:8080'
      expect(location.href).toBe('https://taro.com/hello/world?c=3&d=4#e=5&f=6')
      location.href = 'https://taro.com/pages?name=hongxin#age=18'
      expect(location.href).toBe('https://taro.com/pages?name=hongxin#age=18')
    }

    // more cases for pathname
    {
      Current.router = {
        path: '',
        params: {},
      }
      const location = new Location({ window: fakerWindow })
      expect(location.pathname).toBe('/')
      location.pathname = '/a/b'
      expect(location.pathname).toBe('/a/b')
      location.pathname = './c'
      expect(location.pathname).toBe('/c')
      location.pathname = '/a/b'
      expect(location.pathname).toBe('/a/b')
      location.pathname = '../d'
      expect(location.pathname).toBe('/d')
      location.pathname = '/a/b'
      expect(location.pathname).toBe('/a/b')
      location.pathname = '../../f'
      expect(location.pathname).toBe('/f')
      location.pathname = '../../'
      expect(location.pathname).toBe('/')
      location.pathname = 'a/b'
      expect(location.pathname).toBe('/a/b')
    }

    // methods
    {
      Current.router = {
        path: '',
        params: {},
      }
      const location = new Location({ window: fakerWindow })
      expect(location.href).toBe('https://taro.com/')
      location.replace('https://taro.com/hello/world?name=hongxin#age=18')
      expect(location.href).toBe('https://taro.com/hello/world?name=hongxin#age=18')
    }

    // hashchange
    {
      Current.router = {
        path: '',
        params: {},
      }
      const mockTrigger = jest.fn()
      const location = new Location({ window: { trigger: mockTrigger } })
      expect(location.href).toBe('https://taro.com/')
      location.hash = '#a=1'
      expect(location.href).toBe('https://taro.com/#a=1')
      expect(mockTrigger).toHaveBeenCalledTimes(1)
      location.replace('https://taro.com/hello/world?name=hongxin#age=18')
      expect(location.href).toBe('https://taro.com/hello/world?name=hongxin#age=18')
      expect(mockTrigger).toHaveBeenCalledTimes(2)
    }

    // CONTEXT_ACTIONS
    {
      Current.router = {
        path: '',
        params: { a: '1' },
      }
      const location = new Location({ window: fakerWindow })
      location.replace('https://taro.com/hello/world?b=2')
      const cache = location.cache

      // CONTEXT_ACTIONS.INIT
      location.trigger('0')
      expect(location.href).toBe('https://taro.com/?a=1')

      // CONTEXT_ACTIONS.RESTORE
      const pageId = 'page_' + Date.now()
      location.trigger('1', pageId)
      location.replace('https://taro.com/hello/world?b=2')
      expect(location.href).toBe('https://taro.com/hello/world?b=2')
      expect(cache.has(pageId)).toBe(true)
      expect(cache.get(pageId).lastHref).toBe('https://taro.com/?a=1')

      // CONTEXT_ACTIONS.RECOVER
      location.trigger('2', pageId)
      expect(location.href).toBe('https://taro.com/?a=1')

      // CONTEXT_ACTIONS.DESTORY
      location.trigger('3', pageId)
      expect(cache.has(pageId)).toBe(false)
    }

    Object.assign(Current, JSON.parse(raw))
  })

  it('History', () => {
    const Location = runtime.Location
    const History = runtime.History
    const Current = runtime.Current
    const raw = JSON.stringify(Current)
    const fakerWindow = { trigger () {} }

    {
      Current.router = {
        path: '/1',
        params: {},
      }
      const location = new Location({ window: fakerWindow })
      const history = new History(location, { window: fakerWindow })
      expect(history.length).toBe(1)
      expect(history.state).toBe(null)

      location.href = 'https://taro.com/2'
      expect(history.length).toBe(2)
      expect(history.state).toBe(null)

      location.pathname = '/3'
      location.pathname = '/4'
      location.pathname = '/5'
      expect(history.length).toBe(5)
      expect(history.state).toBe(null)

      history.back()
      expect(history.length).toBe(5)
      expect(history.state).toBe(null)

      history.go(-1)
      expect(history.length).toBe(5)
      expect(history.state).toBe(null)

      history.go(-2)
      expect(history.length).toBe(5)
      expect(history.state).toBe(null)

      history.forward()
      expect(history.length).toBe(5)
      expect(history.state).toBe(null)

      history.go(3)
      expect(history.length).toBe(5)
      expect(history.state).toBe(null)
      expect(location.href).toBe('https://taro.com/5')

      history.pushState({ i: 6 }, '6', 'https://taro.com/6')
      expect(history.length).toBe(6)
      expect(history.state).toMatchObject({ i: 6 })
      expect(location.href).toBe('https://taro.com/6')

      history.replaceState({ i: 7 }, '7', 'https://taro.com/7')
      expect(history.length).toBe(6)
      expect(history.state).toMatchObject({ i: 7 })
      expect(location.href).toBe('https://taro.com/7')
    }

    // CONTEXT_ACTIONS
    {
      Current.router = {
        path: '/1',
        params: {},
      }
      const mockTrigger = jest.fn()
      const location = new Location({ window: fakerWindow })
      const history = new History(location, { window: { trigger: mockTrigger } })
      const cache = history.cache

      history.pushState(null, '', 'https://taro.com/1')
      expect(history.length).toBe(2)

      // CONTEXT_ACTIONS.INIT
      history.trigger('0')
      expect(history.length).toBe(1)

      // CONTEXT_ACTIONS.RESTORE
      const pageId = 'page_' + Date.now()
      history.pushState(null, '', 'https://taro.com/2')
      history.trigger('1', pageId)
      expect(cache.has(pageId)).toBe(true)
      expect(Object.is(cache.get(pageId).location, location))
      expect(cache.get(pageId).cur).toBe(1)

      // CONTEXT_ACTIONS.RECOVER
      history.trigger('2', pageId)
      expect(history.length).toBe(2)
      expect(location.href).toBe('https://taro.com/2')

      // CONTEXT_ACTIONS.DESTORY
      history.trigger('3', pageId)
      expect(cache.has(pageId)).toBe(false)
    }

    Object.assign(Current, JSON.parse(raw))
  })
})
