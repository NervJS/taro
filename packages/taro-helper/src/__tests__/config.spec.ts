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

  test('read config with tips', async () => {
    const result = readConfig(path.join(__dirname, './__mocks__/app.config.ts'))
    expect(result).toEqual(config)
  })

  test('read config with tips', async () => {
    const result = readConfig(path.join(__dirname, './__mocks__/app.config.ts'))
    expect(result).toEqual(config)
  })
})
