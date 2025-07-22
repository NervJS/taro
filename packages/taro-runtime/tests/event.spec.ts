import { afterAll, describe, expect, test, vi } from 'vitest'

import * as runtime from '../src/index'

describe('event', () => {
  const document = runtime.document

  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  test('can addEventListener', () => {
    const div = document.createElement('div')
    const spy = vi.fn()
    div.addEventListener('tap', spy, null)
    const event = runtime.createEvent({
      type: 'tap',
      detail: {},
      target: { dataset: {}, id: '' },
      currentTarget: { dataset: {}, id: '' }
    }, div)
    // mini program event system will do this for us
    div.dispatchEvent(event)
  })

  test('event once should work', () => {
    const div = document.createElement('div')
    const spy = vi.fn()
    div.addEventListener('tap', spy, { once: true })
    const event = runtime.createEvent({
      type: 'tap',
      detail: {},
      target: { dataset: {}, id: '' },
      currentTarget: { dataset: {}, id: '' }
    }, div)
    div.dispatchEvent(event)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
  })

  test('可以多次 dispatchEvent', () => {
    const div = document.createElement('div')
    const spy = vi.fn()
    div.addEventListener('tap', spy, null)
    const event = runtime.createEvent({
      type: 'tap',
      detail: {},
      target: { dataset: {}, id: '' },
      currentTarget: { dataset: {}, id: '' }
    }, div)
    div.dispatchEvent(event)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(2)
  })

  test('同一事件可以添加多个 handlers', () => {
    const div = document.createElement('div')
    const spy = vi.fn()
    const spy2 = vi.fn()
    div.addEventListener('tap', spy, null)
    div.addEventListener('tap', spy2, null)
    const event = runtime.createEvent({
      type: 'tap',
      detail: {},
      target: { dataset: {}, id: '' },
      currentTarget: { dataset: {}, id: '' }
    }, div)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
    expect(spy2).toBeCalledTimes(1)
  })

  test('remove 一个 handler 不会影响其它 handler', () => {
    const div = document.createElement('div')
    const spy = vi.fn()
    const spy2 = vi.fn()
    div.addEventListener('tap', spy, null)
    div.addEventListener('tap', spy2, null)
    const event = runtime.createEvent({
      type: 'tap',
      detail: {},
      target: { dataset: {}, id: '' },
      currentTarget: { dataset: {}, id: '' }
    }, div)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
    expect(spy2).toBeCalledTimes(1)
    div.removeEventListener('tap', spy)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
    expect(spy2).toBeCalledTimes(2)
  })

  test('添加事件名会被小写化', () => {
    const div = document.createElement('div')
    const spy = vi.fn()
    const spy2 = vi.fn()
    div.addEventListener('tap', spy, null)
    div.addEventListener('tap', spy2, null)
    const event = runtime.createEvent({
      type: 'tap',
      detail: {},
      target: { dataset: {}, id: '' },
      currentTarget: { dataset: {}, id: '' }
    }, div)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
    expect(spy2).toBeCalledTimes(1)
    div.removeEventListener('tap', spy)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
    expect(spy2).toBeCalledTimes(2)
  })

  test('remove 空事件也不会报错', () => {
    const div = document.createElement('div')
    expect(() => {
      div.removeEventListener('tap', vi.fn())
    }).not.toThrow()
  })

  test('可以阻止冒泡', () => {
    const container = document.createElement('container')
    const div = document.createElement('div')
    container.appendChild(div)
    const containerSpy = vi.fn()
    const divSpy = vi.fn()
    container.addEventListener('tap', containerSpy, null)
    div.addEventListener('tap', (e: any) => {
      divSpy()
      e.stopPropagation()
    }, null)
    const event = runtime.createEvent({
      type: 'tap',
      detail: {},
      target: { dataset: {}, id: '' },
      currentTarget: { dataset: {}, id: '' }
    }, div)
    div.dispatchEvent(event)
    container.dispatchEvent(event) // bubble event
    expect(divSpy).toBeCalledTimes(1)
    expect(containerSpy).toBeCalledTimes(0)
  })

  test('非冒泡事件不会在父元素触发', () => {
    const eventName = 'unknown'
    const container = document.createElement('container')
    const div = document.createElement('div')
    container.appendChild(div)
    const containerSpy = vi.fn()
    const divSpy = vi.fn()
    container.addEventListener(eventName, containerSpy, null)
    div.addEventListener(eventName, divSpy, null)
    const event = runtime.createEvent({
      type: eventName,
      detail: {},
      target: { dataset: {}, id: '' },
      currentTarget: { dataset: {}, id: '' }
    }, div)
    div.dispatchEvent(event)
    container.dispatchEvent(event) // bubble event
    expect(divSpy).toBeCalledTimes(1)
    expect(containerSpy).toBeCalledTimes(1)
  })

  test('preventDefault', () => {
    const container = document.createElement('container')
    const div = document.createElement('div')
    container.appendChild(div)
    const containerSpy = vi.fn()
    const divSpy = vi.fn()
    container.addEventListener('tap', containerSpy, null)
    div.addEventListener('tap', (e: any) => {
      divSpy()
      e.preventDefault()
    }, null)
    const event = runtime.createEvent({
      type: 'tap',
      detail: {},
      target: { dataset: {}, id: '' },
      currentTarget: { dataset: {}, id: '' }
    }, div)
    div.dispatchEvent(event)
    expect(divSpy).toBeCalledTimes(1)
    expect(event.defaultPrevented).toBe(true)
  })

  test('stopImmediatePropagation()', () => {
    const div = document.createElement('div')
    const spy = vi.fn()
    const spy2 = vi.fn()
    div.addEventListener('tap', spy2, null)
    div.addEventListener('tap', (e: any) => {
      spy()
      e.stopImmediatePropagation()
    }, null)
    const event = runtime.createEvent({
      type: 'tap',
      detail: {},
      target: { dataset: {}, id: '' },
      currentTarget: { dataset: {}, id: '' }
    }, div)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
    expect(spy2).toBeCalledTimes(0)
  })

  test('dispatchEvent 也会被小写', () => {
    const div = document.createElement('div')
    const spy = vi.fn()
    const spy2 = vi.fn()
    div.addEventListener('tap', spy2, null)
    div.addEventListener('tap', (e: any) => {
      spy()
      e.stopImmediatePropagation()
    }, null)
    const event = runtime.createEvent({
      type: 'tap',
      detail: {},
      target: { dataset: {}, id: '' },
      currentTarget: { dataset: {}, id: '' }
    }, div)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
    expect(spy2).toBeCalledTimes(0)
  })

  test('可以发送没有监听的事件', () => {
    const container = document.createElement('container')
    const div = document.createElement('div')
    container.appendChild(div)
    const containerSpy = vi.fn()
    const divSpy = vi.fn()
    const event = runtime.createEvent({
      type: 'tap',
      detail: {},
      target: { dataset: {}, id: '' },
      currentTarget: { dataset: {}, id: '' }
    }, div)
    div.dispatchEvent(event)
    container.dispatchEvent(event) // bubble event
    expect(divSpy).toBeCalledTimes(0)
    expect(containerSpy).toBeCalledTimes(0)
  })
})
