import Taro from '@tarojs/api'

import { loadHarmonyApi } from '../helpers/loadHarmonyApi'

afterEach(() => jest.restoreAllMocks())

it('keeps the Harmony Hybrid preloadAssets placeholder at the public entry', async () => {
  jest.replaceProperty(process.env, 'NODE_ENV', 'production')
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  const appendChild = jest.spyOn(document.head, 'appendChild')
  const unsupported = jest.fn()
  const success = jest.fn()
  const fail = jest.fn()
  const preloadAssets = await loadHarmonyApi('preloadAssets')
  const options = { data: [{ type: 'image' as const, src: '/hero.png' }], success, fail }

  Taro.eventCenter.on('__taroNotSupport', unsupported)
  try {
    const result = preloadAssets(options)
    expect(appendChild).not.toHaveBeenCalled()
    await expect(result).resolves.toEqual({ errMsg: '暂时不支持 API' })
    expect(unsupported).toHaveBeenCalledWith({
      name: 'preloadAssets', args: [options], type: 'method', category: 'temporarily',
    })
    expect(success).toHaveBeenCalledTimes(1)
    expect(fail).not.toHaveBeenCalled()
  } finally {
    Taro.eventCenter.off('__taroNotSupport', unsupported)
  }
})
