import * as Taro from '@tarojs/taro-h5'

describe('debug', () => {
  const payload = [{ str: 'hello world' }, 'log', 100, [1, 2, 3]]

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getLogManager', () => {
    test('returns the same log manager every time', () => {
      expect(Taro.getLogManager({ level: 1 })).toBe(Taro.getLogManager())
    })

    test.each(['debug', 'info', 'log', 'warn'] as const)('writes %s logs to the console', method => {
      const spy = jest.spyOn(console, method).mockImplementation(() => {})
      const logger = Taro.getLogManager()

      logger[method](...payload)
      // Note: 支持解构后调用
      const { [method]: write } = logger
      write('detached')

      expect(spy.mock.calls).toEqual([payload, ['detached']])
    })
  })

  describe('getRealtimeLogManager', () => {
    test('returns the same realtime log manager every time', () => {
      expect(Taro.getRealtimeLogManager()).toBe(Taro.getRealtimeLogManager())
    })

    test.each(['error', 'info', 'warn'] as const)('writes %s logs to the console', method => {
      const spy = jest.spyOn(console, method).mockImplementation(() => {})
      const logger = Taro.getRealtimeLogManager()

      logger[method](...payload)
      const { [method]: write } = logger
      write('detached')

      expect(spy.mock.calls).toEqual([payload, ['detached']])
    })

    test('accepts filter messages and page instances without logging', () => {
      const spies = (['debug', 'error', 'info', 'log', 'warn'] as const).map(method => jest.spyOn(console, method).mockImplementation(() => {}))
      const logger = Taro.getRealtimeLogManager()

      expect(() => {
        logger.setFilterMsg('filter')
        logger.addFilterMsg('another filter')
        logger.in({})
      }).not.toThrow()

      spies.forEach(spy => expect(spy).not.toHaveBeenCalled())
    })

    test.each(['error', 'info', 'warn'] as const)('writes %s key-value logs of a tag to the console', method => {
      const spy = jest.spyOn(console, method).mockImplementation(() => {})
      const tagLogger = Taro.getRealtimeLogManager().tag('plugin')
      const value = { str: 'hello world' }

      tagLogger[method]('key', value)
      const { [method]: write } = tagLogger
      write('detached', 1)

      expect(spy.mock.calls).toEqual([['[plugin]', 'key', value], ['[plugin]', 'detached', 1]])
    })

    test('accepts filter messages of a tag without logging', () => {
      const spies = (['debug', 'error', 'info', 'log', 'warn'] as const).map(method => jest.spyOn(console, method).mockImplementation(() => {}))
      const tagLogger = Taro.getRealtimeLogManager().tag('plugin')

      expect(() => {
        tagLogger.setFilterMsg('filter')
        tagLogger.addFilterMsg('another filter')
      }).not.toThrow()

      spies.forEach(spy => expect(spy).not.toHaveBeenCalled())
    })
  })
})
