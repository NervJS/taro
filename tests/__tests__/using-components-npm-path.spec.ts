import HarmonyPlugin from '@tarojs/webpack5-runner/dist/plugins/HarmonyPlugin'
import MiniPlugin from '@tarojs/webpack5-runner/dist/plugins/MiniPlugin'

describe.each([
  ['MiniPlugin', MiniPlugin],
  ['HarmonyPlugin', HarmonyPlugin],
])('%s adjustConfigContent', (_name, Plugin: any) => {
  function adjust (usingComponents: Record<string, string>) {
    const plugin = Object.create(Plugin.prototype)
    plugin.options = {}
    const config = { usingComponents }
    plugin.adjustConfigContent(config)
    return config.usingComponents
  }

  test('should point node_modules components to /npm with forward slashes', () => {
    expect(adjust({
      't-button': '../../../node_modules/tdesign-miniprogram/miniprogram_dist/button/button',
      'van-button': 'D:\\project\\node_modules\\@vant\\weapp\\lib\\button\\index',
    })).toEqual({
      't-button': '/npm/tdesign-miniprogram/miniprogram_dist/button/button',
      'van-button': '/npm/@vant/weapp/lib/button/index',
    })
  })

  test('should keep adjusting after a component outside node_modules', () => {
    expect(adjust({
      'local-comp': '../../components/local/index',
      't-button': '../../../node_modules/tdesign-miniprogram/miniprogram_dist/button/button',
    })).toEqual({
      'local-comp': '../../components/local/index',
      't-button': '/npm/tdesign-miniprogram/miniprogram_dist/button/button',
    })
  })
})
