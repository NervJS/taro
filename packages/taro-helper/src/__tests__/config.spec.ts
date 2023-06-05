import * as path from 'path'

import { readConfig } from '../utils'

describe('readConfig', () => {
  const config = {
    pages: [
      'pages/index/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  test('read config without tips', async () => {
    const result = readConfig(path.join(__dirname, './__mocks__/app.config.ts'))
    expect(result).toEqual(config)
  })

  test('read config with tips', async () => {
    const result = readConfig(path.join(__dirname, './__mocks__/app.define.config.ts'))
    expect(result).toEqual(config)
  })

  test('read config with import', async () => {
    const logSpy = jest.spyOn(console, 'log')
    logSpy.mockImplementation(() => {})

    const result = readConfig(path.join(__dirname, './__mocks__/app.import.config.ts'))
    expect(result).toEqual(config)

    /** FIXME: 测试环境下，requireFromString 基于 module 引入的 console.log 不会被 jest.spyOn 捕获，
     * 通过 module 引入的文件与测试环境上下文隔离，在 setup 加载的 process.env 变量也不会在其中生效。
     *
     * **Note:** 生产环境下，requireFromString 与 require 表现一致，验证无该问题。
     */
    // expect(logSpy).toBeCalledWith('process.env.TARO_ENV', 'weapp')
    logSpy.mockRestore()
  })

  test('read config with require', async () => {
    const result = readConfig(path.join(__dirname, './__mocks__/app.require.config.ts'))
    expect(result).toEqual(config)
  })

  test('read json config', async () => {
    const result = readConfig(path.join(__dirname, './__mocks__/app.json'))
    expect(result).toEqual(config)
  })
})
