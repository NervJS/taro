describe('BOM', () => {
  process.env.FRAMEWORK = 'nerv'
  const runtime = require('../../dist/runtime.esm')
  global.window = runtime.window

  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  describe('URL', () => {
    it('URL 构造函数的 path 和 base 参数拼接算法', () => {
      const doubleSlashURL = new URL('//double/slash/path', 'https://example.com/') + ''
      expect(doubleSlashURL).toBe('https://double/slash/path')

      const absoluteURL1 = new URL('/absolute/path', 'https://example.com/') + ''
      expect(absoluteURL1).toBe('https://example.com/absolute/path')

      const absoluteURL2 = new URL('/absolute/path', 'https://example.com/exist/path') + ''
      expect(absoluteURL2).toBe('https://example.com/absolute/path')

      const relativeURL1 = new URL('relative/path', 'https://example.com/exist/path') + ''
      expect(relativeURL1).toBe('https://example.com/exist/relative/path')

      const relativeURL2 = new URL('relative/path', 'https://example.com/exist/path/') + ''
      expect(relativeURL2).toBe('https://example.com/exist/path/relative/path')
    })

    it('URL path 折叠算法', () => {
      const currentPath1 = new URL('./current/path', 'https://example.com/exist/path/') + ''
      expect(currentPath1).toBe('https://example.com/exist/path/current/path')

      const currentPath2 = new URL('./current/path', 'https://example.com/exist/path') + ''
      expect(currentPath2).toBe('https://example.com/exist/current/path')

      const parentPath1 = new URL('../parent/path', 'https://example.com/exist/path/') + ''
      expect(parentPath1).toBe('https://example.com/exist/parent/path')

      const parentPath2 = new URL('../parent/path', 'https://example.com/exist/path') + ''
      expect(parentPath2).toBe('https://example.com/parent/path')

      const parentPath3 = new URL('../../parent/path', 'https://example.com/exist/path/') + ''
      expect(parentPath3).toBe('https://example.com/parent/path')

      const parentPath4 = new URL('../../parent/path', 'https://example.com/exist/path') + ''
      expect(parentPath4).toBe('https://example.com/parent/path')
    })

    it('URL path 边界情况', () => {
      const consecutiveSlashes = new URL('///path', 'https://example.com/') + ''
      expect(consecutiveSlashes).toBe('https://path/')

      const emptySegment = new URL('/foo//../bar', 'https://example.com/') + ''
      expect(emptySegment).toBe('https://example.com/foo/bar')

      const multipleDots = new URL('./././path', 'https://example.com/base/') + ''
      expect(multipleDots).toBe('https://example.com/base/path')

      const beyondRoot = new URL('../../../path', 'https://example.com/only/one/') + ''
      expect(beyondRoot).toBe('https://example.com/path')
    })
  })
})
