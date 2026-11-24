import Taro from '@tarojs/api'

import { loadHarmonyApi } from '../helpers/loadHarmonyApi'

afterEach(() => jest.restoreAllMocks())

it('keeps the Harmony Hybrid createOffscreenCanvas placeholder at the public entry', async () => {
  jest.replaceProperty(process.env, 'NODE_ENV', 'production')
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  const createElement = jest.spyOn(document, 'createElement')
  const unsupported = jest.fn()
  const createOffscreenCanvas = await loadHarmonyApi('createOffscreenCanvas')
  const options = { type: '2d' as const, width: 20, height: 10 }

  Taro.eventCenter.on('__taroNotSupport', unsupported)
  try {
    await expect(createOffscreenCanvas(options)).resolves.toEqual({ errMsg: '暂时不支持 API' })
    expect(unsupported).toHaveBeenCalledWith({
      name: 'createOffscreenCanvas', args: [options], type: 'method', category: 'temporarily',
    })
    expect(createElement).not.toHaveBeenCalled()
  } finally {
    Taro.eventCenter.off('__taroNotSupport', unsupported)
  }
})
