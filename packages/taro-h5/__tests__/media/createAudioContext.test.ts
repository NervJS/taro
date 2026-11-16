import { Current } from '@tarojs/runtime'
import { createAudioContext } from '@tarojs/taro-h5'

describe('createAudioContext', () => {
  const originalPage = Current.page

  function mount (path: string, id: string) {
    const page = document.createElement('div')
    page.id = path
    const host = document.createElement('taro-audio-core')
    host.id = id
    const audio = document.createElement('audio')
    host.appendChild(audio)
    page.appendChild(host)
    document.body.appendChild(page)
    Current.page = { path } as typeof Current.page
    return { page, audio }
  }

  afterEach(() => {
    Current.page = originalPage
    document.body.replaceChildren()
    jest.restoreAllMocks()
  })

  it('controls the component and keeps the context scoped to its original page', () => {
    const id = 'track" [1]'
    const first = mount('/pages/first', id)
    const context = createAudioContext(id)
    const second = mount('/pages/second', id)
    const play = jest.spyOn(first.audio, 'play').mockResolvedValue(undefined)
    const pause = jest.spyOn(first.audio, 'pause').mockImplementation(() => {})
    const otherPlay = jest.spyOn(second.audio, 'play').mockResolvedValue(undefined)

    context.setSrc('/track.mp3')
    context.seek(8)
    context.play()
    context.pause()
    expect(first.audio.src).toBe('http://localhost/track.mp3')
    expect(first.audio.currentTime).toBe(8)
    expect(play).toHaveBeenCalledTimes(1)
    expect(pause).toHaveBeenCalledTimes(1)
    expect(otherPlay).not.toHaveBeenCalled()

    first.page.remove()
    context.play()
    expect(play).toHaveBeenCalledTimes(1)
    expect(otherPlay).not.toHaveBeenCalled()
  })

  it('handles a browser playback rejection for the void API', async () => {
    const { audio } = mount('/pages/audio', 'track')
    const error = new DOMException('Playback blocked', 'NotAllowedError')
    jest.spyOn(audio, 'play').mockRejectedValue(error)
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})

    expect(createAudioContext('track').play()).toBeUndefined()
    await Promise.resolve()
    expect(warn).toHaveBeenCalledWith('AudioContext.play:', error)
  })
})
