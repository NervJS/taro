// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react'

let document
let render
let runtime

describe('Context', () => {
  beforeAll(() => {
    process.env.FRAMEWORK = 'react'
    runtime = require('@tarojs/runtime')
    render = require('../dist/index').render
    document = runtime.document
  })

  afterAll(() => {
    process.env.FRAMEWORK = undefined
  })

  describe('setValueOnElement', () => {
    it('should set values as properties by default', () => {
      const container = document.createElement('div')
      render(<div title="Tip!" />, container)
      expect(container.firstChild.getAttribute('title')).toBe('Tip!')
    })

    it('should set values as attributes if necessary', () => {
      const container = document.createElement('div')
      render(<div role="#" />, container)
      expect(container.firstChild.getAttribute('role')).toBe('#')
      expect(container.firstChild.role).toBeUndefined()
    })

    it('should set values as attributes for specific props', () => {
      const container = document.createElement('div')
      render(<view type="button" id="test" />, container)
      expect(container.firstChild.getAttribute('type')).toBe('button')
      expect(container.firstChild.id).toBe('test')
    })

    it('className should works as class', () => {
      const container = document.createElement('div')
      render(<input type="button" className='test' />, container)
      expect(container.firstChild.getAttribute('class')).toBe('test')
    })

    it('string style', () => {
      const container = document.createElement('div')
      render(<input type="button" style='color: red' />, container)
      expect(container.firstChild.getAttribute('style')).toBe('color: red;')
    })

    it('object style', () => {
      const container = document.createElement('div')
      render(<input type="button" style={{ color: 'red' }} />, container)
      expect(container.firstChild.getAttribute('style')).toBe('color: red;')
    })

    it('set style as number', () => {
      const container = document.createElement('div')
      render(<input type="button" style={{ fontSize: 14 }} />, container)
      expect(container.firstChild.getAttribute('style')).toBe('font-size: 14px;')
    })

    it('set css var as number should not add "px" suffix', () => {
      const container = document.createElement('div')
      render(<input type="button" style={{ '--taro': 14 }} />, container)
      expect(container.firstChild.getAttribute('style')).toBe('--taro: 14;')
    })

    it('set animation-iteration-count of style as number should not add "px" suffix', async () => {
      const container = document.createElement('div')
      render(<view style={{ animationIterationCount: 1 }} />, container)
      expect(container.firstChild.getAttribute('style')).toBe('animation-iteration-count: 1;')
    })

    it('onClick should work like onTap', () => {
      const container = document.createElement('div')
      const spy = jest.fn()
      render(<view type="button" onClick={spy} />, container)
      expect('tap' in container.firstChild.__handlers).toBe(true)
    })

    it('can dispatch event', () => {
      const createEvent = runtime.createEvent
      const container = document.createElement('div')
      const spy = jest.fn()
      render(<view type="button" onClick={spy} id='fork' />, container)
      const event = createEvent({ type: 'tap', currentTarget: { id: container.firstChild.uid }, target: { id: container.firstChild.uid } })
      container.firstChild.dispatchEvent(event)
      expect(spy).toBeCalled()
    })

    it('should patch properies properly', () => {
      const container = document.createElement('div')
      render(<div id='1' />, container)
      render(<div id='2' />, container)
      expect(container.firstChild.id).toBe('2')
    })

    it('should patch properies properly 2', () => {
      const container = document.createElement('div')
      render(<div id='1' a='a' />, container)
      render(<div id='2' b='b' />, container)
      expect(container.firstChild.id).toBe('2')
      expect(container.firstChild.getAttribute('a')).toBe('')
      expect(container.firstChild.getAttribute('b')).toBe('b')
    })

    it('should ignore ref', () => {
      const container = document.createElement('div')
      render(<div ref={React.createRef} />, container)
      expect(container.firstChild.getAttribute('ref')).toBe('')
    })
  })
})
