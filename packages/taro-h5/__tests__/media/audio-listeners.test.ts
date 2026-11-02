import Taro from '@tarojs/api'

import { createInnerAudioContext } from '../../src/api/media/audio'
import { InnerAudioContext } from '../../src/api/media/audio/InnerAudioContext'

const events = [
  ['Canplay', 'canplay'],
  ['Play', 'play'],
  ['Pause', 'pause'],
  ['Stop', 'stop'],
  ['Ended', 'ended'],
  ['TimeUpdate', 'timeupdate'],
  ['Error', 'error'],
  ['Waiting', 'waiting'],
  ['Seeking', 'seeking'],
  ['Seeked', 'seeked']
] as const

describe('InnerAudioContext listener removal', () => {
  let contexts: InnerAudioContext[]

  beforeEach(() => {
    contexts = []
    jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  })

  afterEach(() => {
    contexts.forEach(context => context.destroy())
    jest.restoreAllMocks()
  })

  function create () {
    const context = createInnerAudioContext() as InnerAudioContext
    contexts.push(context)
    return context
  }

  function emit (context: InnerAudioContext, event: string) {
    if (event === 'stop') context.stop()
    else context.Instance!.dispatchEvent(new Event(event))
  }

  describe.each(events)('off%s', (suffix, event) => {
    test('without a callback removes all user listeners and allows subscribing again', () => {
      const context = create()
      const first = jest.fn()
      const second = jest.fn()
      context[`on${suffix}`](first)
      context[`on${suffix}`](second)
      context[`off${suffix}`]()
      emit(context, event)
      expect(first).not.toHaveBeenCalled()
      expect(second).not.toHaveBeenCalled()

      context[`on${suffix}`](second)
      emit(context, event)
      expect(first).not.toHaveBeenCalled()
      expect(second).toHaveBeenCalledTimes(1)
    })

    test('explicit undefined and repeated removal also clear all listeners', () => {
      const context = create()
      const listener = jest.fn()
      context[`off${suffix}`]()
      context[`on${suffix}`](listener)
      context[`off${suffix}`](undefined)
      context[`off${suffix}`]()
      emit(context, event)
      expect(listener).not.toHaveBeenCalled()
    })

    test('a callback removes only that listener and an unknown callback removes none', () => {
      const context = create()
      const first = jest.fn()
      const second = jest.fn()
      context[`on${suffix}`](first)
      context[`on${suffix}`](second)
      context[`off${suffix}`](jest.fn())
      emit(context, event)
      expect(first).toHaveBeenCalledTimes(1)
      expect(second).toHaveBeenCalledTimes(1)
      context[`off${suffix}`](first)
      emit(context, event)
      expect(first).toHaveBeenCalledTimes(1)
      expect(second).toHaveBeenCalledTimes(2)
    })
  })

  test('offPlay preserves the internal first-play startTime handling', () => {
    const context = create()
    context.startTime = 12
    const listener = jest.fn()
    context.onPlay(listener)
    context.offPlay()
    emit(context, 'play')
    expect(listener).not.toHaveBeenCalled()
    expect(context.currentTime).toBe(12)
    context.seek(3)
    emit(context, 'play')
    expect(context.currentTime).toBe(3)
  })

  test('removal is isolated by event and audio context', () => {
    const first = create()
    const second = create()
    const play = jest.fn()
    const pause = jest.fn()
    const otherPlay = jest.fn()
    first.onPlay(play)
    first.onPause(pause)
    second.onPlay(otherPlay)
    first.offPlay()
    emit(first, 'play')
    emit(first, 'pause')
    emit(second, 'play')
    expect(play).not.toHaveBeenCalled()
    expect(pause).toHaveBeenCalledTimes(1)
    expect(otherPlay).toHaveBeenCalledTimes(1)
  })

  test('DOM callbacks retain their event, this and native duplicate-registration behavior', () => {
    const context = create()
    const audio = context.Instance!
    const listener = jest.fn(function (this: HTMLAudioElement, event: Event) {
      expect(this).toBe(audio)
      expect(event.target).toBe(audio)
    })
    context.onPlay(listener)
    context.onPlay(listener)
    emit(context, 'play')
    expect(listener).toHaveBeenCalledTimes(1)
    context.offPlay(listener)
    emit(context, 'play')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  test('offPlay during dispatch keeps native removal semantics for later listeners', () => {
    const context = create()
    const second = jest.fn()
    context.onPlay(() => context.offPlay())
    context.onPlay(second)
    emit(context, 'play')
    expect(second).not.toHaveBeenCalled()
  })

  test('destroy detaches listeners from the retained audio element and remains idempotent', () => {
    const context = create()
    const audio = context.Instance!
    const play = jest.fn()
    const error = jest.fn()
    context.onPlay(play)
    context.onError(error)
    context.destroy()
    audio.dispatchEvent(new Event('play'))
    audio.dispatchEvent(new Event('error'))
    Taro.eventCenter.trigger('__taroRouterChange')
    expect(play).not.toHaveBeenCalled()
    expect(error).not.toHaveBeenCalled()
    expect(context.errorStack.count()).toBe(0)
    expect(context.stopStack.count()).toBe(0)
    expect(() => context.destroy()).not.toThrow()
    for (const [suffix] of events) {
      expect(() => context[`off${suffix}`]()).not.toThrow()
    }
  })
})
