import * as helper from '@tarojs/helper'
import { Alipay } from '@tarojs/plugin-platform-alipay'

import { compile, getOutput } from './utils/compiler'

describe('tabbar', () => {
  test('should weapp tabbar work', async () => {
    const { stats, config } = await compile('tabbar', { platformType: 'mini' })
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should alipay tabbar work', async () => {
    const program = new Alipay({ helper } as any, {})

    const { stats, config } = await compile('tabbar', {
      platformType: 'mini',
      buildAdapter: 'alipay',
      globalObject: program.globalObject,
      fileType: program.fileType,
      template: program.template,
      runtimePath: program.runtimePath
    })
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should keep name_locale when converting the alipay tabbar', () => {
    let modifyMiniConfigs
    const program = new Alipay({ helper, modifyMiniConfigs: fn => { modifyMiniConfigs = fn } } as any, {})
    program.modifyMiniConfigs()

    const content = {
      tabBar: {
        color: '#999999',
        list: [{
          pagePath: 'pages/index/index',
          text: '首页',
          name_locale: { zh_CN: '首页', en_US: 'Home' },
          iconPath: 'assets/home.png',
          selectedIconPath: 'assets/home-active.png'
        }]
      }
    }
    modifyMiniConfigs({ configMap: { app: { content } } })

    expect(content.tabBar).toEqual({
      textColor: '#999999',
      items: [{
        pagePath: 'pages/index/index',
        name: '首页',
        name_locale: { zh_CN: '首页', en_US: 'Home' },
        icon: 'assets/home.png',
        activeIcon: 'assets/home-active.png'
      }]
    })
  })
})

describe('custom tabbar', () => {
  test('should weapp custom tabbar work', async () => {
    const { stats, config } = await compile('custom-tabbar', { platformType: 'mini' })
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
