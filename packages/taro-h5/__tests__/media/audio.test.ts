import Taro from '@tarojs/api'

import { InnerAudioContext } from '../../src/api/media/audio/InnerAudioContext'

describe('InnerAudioContext', () => {
  afterEach(() => jest.restoreAllMocks())

  test('removes the router listener and callbacks when destroyed', () => {
    const audio = {
      addEventListener: jest.fn(),
      pause: jest.fn(),
      removeAttribute: jest.fn(),
      currentTime: 0,
      onerror: null
    }
    jest.spyOn(window, 'Audio').mockImplementation(() => audio as unknown as HTMLAudioElement)

    const context = new InnerAudioContext()
    const onStop = jest.fn()
    context.onStop(onStop)
    const stop = jest.spyOn(context, 'stop')

    Taro.eventCenter.trigger('__taroRouterChange')
    expect(stop).toHaveBeenCalledTimes(1)

    context.destroy()
    expect(onStop).toHaveBeenCalledTimes(2)
    expect(audio.onerror).toBeNull()
    expect(audio.removeAttribute).toHaveBeenCalledWith('src')
    expect(context.stopStack.count()).toBe(0)
    expect(context.Instance).toBeUndefined()

    Taro.eventCenter.trigger('__taroRouterChange')
    context.destroy()
    expect(stop).toHaveBeenCalledTimes(2)
    expect(onStop).toHaveBeenCalledTimes(2)
  })
})
