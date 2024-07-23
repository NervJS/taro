/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react'
import ReactDOM from 'react-dom/client'

import withWeapp from '../src'
import { TaroComponent } from './utils'

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
      componentDidMount () {
        expect(scratch.textContent).toBe('a')
        done()
      }

      render () {
        return <div>{this.data.a}</div>
      }
    }

    const root = ReactDOM.createRoot(scratch)
    root.render(<A />)
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
      componentDidUpdate () {
        expect(scratch.textContent).toBe('b')
        done()
      }

      render () {
        return <div>{this.data.a}</div>
      }
    }

    const root = ReactDOM.createRoot(scratch)
    root.render(<A />)
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
      componentDidUpdate () {
        expect(scratch.textContent).toBe('b')
        done()
      }

      render () {
        return <div>{this.data.a.b}</div>
      }
    }

    const root = ReactDOM.createRoot(scratch)
    root.render(<A />)
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
      componentDidUpdate () {
        expect(scratch.textContent).toBe('b')
        done()
      }

      render () {
        return <div>{this.data.a}</div>
      }
    }

    const root = ReactDOM.createRoot(scratch)
    root.render(<A />)
  })
})
