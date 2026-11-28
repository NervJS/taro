import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { Audio } from '../src/components/audio/audio'

it('reports elapsed playback time separately from duration', async () => {
  const page = await newSpecPage({
    components: [Audio],
    template: () => <taro-audio-core />,
  })
  const audio = page.root!.querySelector('audio')!
  Object.defineProperty(audio, 'duration', { configurable: true, value: 120 })
  audio.currentTime = 12
  const listener = jest.fn()
  page.root!.addEventListener('timeupdate', listener)
  const event = new Event('timeupdate')
  Object.defineProperty(event, 'srcElement', { value: audio })
  audio.dispatchEvent(event)

  expect(listener.mock.calls[0][0].detail).toEqual({ currentTime: 12, duration: 120 })
})
