/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

describe('event', () => {
  const runtime = require('../../dist/runtime.esm')
  const document = runtime.document

  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  it('can addEventListener', () => {
    const div = document.createElement('div')
    const spy = jest.fn()
    div.addEventListener('tap', spy)
    const event = runtime.createEvent({ type: 'tap' }, div)
    // mini program event system will do this for us
    div.dispatchEvent(event)
  })

  it('event once should work', () => {
    const div = document.createElement('div')
    const spy = jest.fn()
    div.addEventListener('tap', spy, { once: true })
    const event = runtime.createEvent({ type: 'tap' }, div)
    div.dispatchEvent(event)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
  })

  it('可以多次 dispatchEvent', () => {
    const div = document.createElement('div')
    const spy = jest.fn()
    div.addEventListener('tap', spy)
    const event = runtime.createEvent({ type: 'tap' }, div)
    div.dispatchEvent(event)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(2)
  })

  it('同一事件可以添加多个 handlers', () => {
    const div = document.createElement('div')
    const spy = jest.fn()
    const spy2 = jest.fn()
    div.addEventListener('tap', spy)
    div.addEventListener('tap', spy2)
    const event = runtime.createEvent({ type: 'tap' }, div)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
    expect(spy2).toBeCalledTimes(1)
  })

  it('remove 一个 handler 不会影响其它 handler', () => {
    const div = document.createElement('div')
    const spy = jest.fn()
    const spy2 = jest.fn()
    div.addEventListener('tap', spy)
    div.addEventListener('tap', spy2)
    const event = runtime.createEvent({ type: 'tap' }, div)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
    expect(spy2).toBeCalledTimes(1)
    div.removeEventListener('tap', spy)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
    expect(spy2).toBeCalledTimes(2)
  })

  it('添加事件名会被小写化', () => {
    const div = document.createElement('div')
    const spy = jest.fn()
    const spy2 = jest.fn()
    div.addEventListener('Tap', spy)
    div.addEventListener('TAP', spy2)
    const event = runtime.createEvent({ type: 'tap' }, div)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
    expect(spy2).toBeCalledTimes(1)
    div.removeEventListener('tap', spy)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
    expect(spy2).toBeCalledTimes(2)
  })

  it('remove 空事件也不会报错', () => {
    const div = document.createElement('div')
    expect(() => {
      div.removeEventListener('tap', jest.fn())
    }).not.toThrow()
  })

  it('可以阻止冒泡', () => {
    const container = document.createElement('container')
    const div = document.createElement('div')
    container.appendChild(div)
    const containerSpy = jest.fn()
    const divSpy = jest.fn()
    container.addEventListener('tap', containerSpy)
    div.addEventListener('tap', (e) => {
      divSpy()
      e.stopPropagation()
    })
    const event = runtime.createEvent({ type: 'tap' }, div)
    div.dispatchEvent(event)
    container.dispatchEvent(event) // buble event
    expect(divSpy).toBeCalledTimes(1)
    expect(containerSpy).toBeCalledTimes(0)
  })

  it('非冒泡事件不会在父元素触发', () => {
    const eventName = 'unknown'
    const container = document.createElement('container')
    const div = document.createElement('div')
    container.appendChild(div)
    const containerSpy = jest.fn()
    const divSpy = jest.fn()
    container.addEventListener(eventName, containerSpy)
    div.addEventListener(eventName, divSpy)
    const event = runtime.createEvent({ type: eventName }, div)
    div.dispatchEvent(event)
    container.dispatchEvent(event) // buble event
    expect(divSpy).toBeCalledTimes(1)
    expect(containerSpy).toBeCalledTimes(1)
  })

  it('preventDefault', () => {
    const container = document.createElement('container')
    const div = document.createElement('div')
    container.appendChild(div)
    const containerSpy = jest.fn()
    const divSpy = jest.fn()
    container.addEventListener('tap', containerSpy)
    div.addEventListener('tap', (e) => {
      divSpy()
      e.preventDefault()
    })
    const event = runtime.createEvent({ type: 'tap' }, div)
    div.dispatchEvent(event)
    expect(divSpy).toBeCalledTimes(1)
    expect(event.defaultPrevented).toBe(true)
  })

  it('stopImmediatePropagation()', () => {
    const div = document.createElement('div')
    const spy = jest.fn()
    const spy2 = jest.fn()
    div.addEventListener('tap', spy2)
    div.addEventListener('tap', (e) => {
      spy()
      e.stopImmediatePropagation()
    })
    const event = runtime.createEvent({ type: 'tap' }, div)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
    expect(spy2).toBeCalledTimes(0)
  })

  it('dispatchEvent 也会被小写', () => {
    const div = document.createElement('div')
    const spy = jest.fn()
    const spy2 = jest.fn()
    div.addEventListener('tap', spy2)
    div.addEventListener('tap', (e) => {
      spy()
      e.stopImmediatePropagation()
    })
    const event = runtime.createEvent({ type: 'Tap' }, div)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
    expect(spy2).toBeCalledTimes(0)
  })

  it('可以发送没有监听的事件', () => {
    const container = document.createElement('container')
    const div = document.createElement('div')
    container.appendChild(div)
    const containerSpy = jest.fn()
    const divSpy = jest.fn()
    const event = runtime.createEvent({ type: 'tap' }, div)
    div.dispatchEvent(event)
    container.dispatchEvent(event) // buble event
    expect(divSpy).toBeCalledTimes(0)
    expect(containerSpy).toBeCalledTimes(0)
  })
})
