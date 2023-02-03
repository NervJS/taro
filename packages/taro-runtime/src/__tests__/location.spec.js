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
      const searchParams = new URL('http://taro.com/?a=1&b=2').searchParams
      expect(searchParams.keys()).toEqual(['a', 'b'])
      expect(searchParams.get('a')).toBe('1')
      expect(searchParams.get('b')).toBe('2')
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
})
