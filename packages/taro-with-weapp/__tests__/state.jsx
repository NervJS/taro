/** @jsx createElement */
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement, render } from 'nervjs'

import withWeapp from '../src'
import { delay, TaroComponent } from './utils'

describe('lifecycle', () => {
  /**
   * @type {Element} scratch
   */
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
  })

  test('state can destruct from this', (done) => {
    @withWeapp({
      data: {
        a: 'a'
      }
    })
    class A extends TaroComponent {
      render () {
        return <div>{this.data.a}</div>
      }
    }

    render(<A />, scratch)

    delay(() => {
      expect(scratch.textContent).toBe('a')
      done()
    })
  })

  test('state can be changed by this.setData', (done) => {
    @withWeapp({
      data: {
        a: ''
      },
      attached () {
        this.setData({
          a: 'b'
        })
      }
    })
    class A extends TaroComponent {
      render () {
        return <div>{this.data.a}</div>
      }
    }

    render(<A />, scratch)

    delay(() => {
      expect(scratch.textContent).toBe('b')
      done()
    })
  })

  test('state can be changed by this.setData path', (done) => {
    @withWeapp({
      data: {
        a: {
          b: ''
        }
      },
      attached () {
        this.setData({
          'a.b': 'b'
        })
      }
    })
    class A extends TaroComponent {
      render () {
        return <div>{this.data.a.b}</div>
      }
    }

    render(<A />, scratch)

    delay(() => {
      expect(scratch.textContent).toBe('b')
      done()
    })
  })

  test('state can be changed even not init data is provided', (done) => {
    @withWeapp({
      data: {
      },
      attached () {
        this.setData({
          a: 'b'
        })
      }
    })
    class A extends TaroComponent {
      render () {
        return <div>{this.data.a}</div>
      }
    }

    render(<A />, scratch)

    delay(() => {
      expect(scratch.textContent).toBe('b')
      done()
    })
  })
})
