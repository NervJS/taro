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
})
