import { createWebAudioContext } from '@tarojs/taro-h5'

describe('createWebAudioContext', () => {
  const original = Object.getOwnPropertyDescriptor(window, 'AudioContext')

  afterEach(() => {
    if (original) {
      Object.defineProperty(window, 'AudioContext', original)
    } else {
      Reflect.deleteProperty(window, 'AudioContext')
    }
  })

  it('returns a new native context for each call', () => {
    const resume = jest.fn()
    const AudioContext = jest.fn().mockImplementation(() => ({ resume }))
    Object.defineProperty(window, 'AudioContext', { configurable: true, value: AudioContext })

    const first = createWebAudioContext()
    expect(first).not.toBe(createWebAudioContext())
    expect(AudioContext).toHaveBeenCalledTimes(2)
    first.resume()
    expect(resume).toHaveBeenCalledTimes(1)
  })

  it('throws synchronously when AudioContext is unavailable', () => {
    Object.defineProperty(window, 'AudioContext', { configurable: true, value: undefined })
    expect(() => createWebAudioContext()).toThrow('AudioContext is not supported')
  })
})
