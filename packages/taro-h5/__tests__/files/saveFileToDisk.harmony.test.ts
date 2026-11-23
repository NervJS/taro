import Taro from '@tarojs/api'

import { saveFileToDisk } from '../../../taro-platform-harmony-hybrid/src/api/apis/files'

// Resolve the Harmony build aliases and isolate its native bridge in jsdom.
jest.mock('src/api/apis/utils', () => jest.requireActual('../../../taro-platform-harmony-hybrid/src/api/apis/utils'), { virtual: true })
jest.mock('src/api/apis/utils/handler', () => jest.requireActual('../../../taro-platform-harmony-hybrid/src/api/apis/utils/handler'), { virtual: true })
jest.mock('../../../taro-platform-harmony-hybrid/src/api/apis/NativeApi', () => ({}))

afterEach(() => jest.restoreAllMocks())

it('reports saveFileToDisk as unsupported in Harmony Hybrid without requesting a download', async () => {
  jest.replaceProperty(process.env, 'NODE_ENV', 'production')
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  const unsupported = jest.fn()
  const options = { filePath: '/reports/monthly.csv' }

  Taro.eventCenter.on('__taroNotSupport', unsupported)
  try {
    await expect(saveFileToDisk(options)).resolves.toEqual({ errMsg: '暂时不支持 API' })
    expect(unsupported).toHaveBeenCalledWith({
      name: 'saveFileToDisk',
      args: [options],
      type: 'method',
      category: 'temporarily',
    })
    expect(click).not.toHaveBeenCalled()
  } finally {
    Taro.eventCenter.off('__taroNotSupport', unsupported)
  }
})
