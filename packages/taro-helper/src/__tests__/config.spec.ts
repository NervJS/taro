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
    const result = readConfig(path.join(__dirname, './__mocks__/app.import.config.ts'))
    expect(result).toEqual(config)
  })

  test('read config with require', async () => {
    const result = readConfig(path.join(__dirname, './__mocks__/app.require.config.ts'))
    expect(result).toEqual(config)
  })

  test('read json config', async () => {
    const result = readConfig(path.join(__dirname, './__mocks__/app.config.json'))
    expect(result).toEqual(config)
  })
})
