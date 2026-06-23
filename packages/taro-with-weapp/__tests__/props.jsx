/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react'
import ReactDOM from 'react-dom/client'

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

  test('default props should work', (done) => {
    @withWeapp({
      properties: {
        a: {
          type: String,
          value: 'a'
        }
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

  test('can access from this.data', (done) => {
    @withWeapp({
      properties: {
        a: {
          type: String,
          value: 'a'
        }
      }
    })
    class A extends TaroComponent {
      render () {
        return <div>{this.data.a}</div>
      }
    }

    @withWeapp({})
    class B extends TaroComponent {
      componentDidMount () {
        expect(scratch.textContent).toBe('b')
        done()
      }

      render () {
        return <A a='b' />
      }
    }

    const root = ReactDOM.createRoot(scratch)
    root.render(<B />)
  })

  test('observer should emit in first render', done => {
    const spy = jest.fn()

    @withWeapp({
      properties: {
        a: {
          type: String,
          value: 'a',
          observer: (newVal, oldVal) => {
            spy(newVal, oldVal)
          }
        }
      }
    })
    class A extends TaroComponent {
      render () {
        return <div>{this.data.a}</div>
      }
    }

    @withWeapp({})
    class B extends TaroComponent {
      componentDidMount () {
        expect(scratch.textContent).toBe('b')
        expect(spy).toBeCalled()
        expect(spy).toBeCalledWith('b', 'a')
        done()
      }

      render () {
        return <A a='b' />
      }
    }

    const root = ReactDOM.createRoot(scratch)
    root.render(<B />)
  })

  test('observer should work', done => {
    const spy = jest.fn()

    let inst

    @withWeapp({
      properties: {
        a: {
          type: String,
          value: 'a',
          observer: (newVal, oldVal) => {
            spy(newVal, oldVal)
          }
        }
      }
    })
    class A extends TaroComponent {
      componentDidMount () {
        expect(scratch.textContent).toBe('b')
        expect(spy).toBeCalled()
        expect(spy).toBeCalledWith('b', 'a')

        inst.setData({ a: 'b' })
        inst.forceUpdate()
        expect(spy).toBeCalledWith('b', 'a')
        done()
      }

      render () {
        return <div>{this.data.a}</div>
      }
    }

    @withWeapp({
      data: {
        b: 'b'
      }
    })
    class B extends TaroComponent {
      constructor (props) {
        super(props)
        inst = this
      }

      render () {
        return <A a={this.data.b} />
      }
    }

    const root = ReactDOM.createRoot(scratch)
    root.render(<B />)
  })

  test('trigger event should work', done => {
    const spy = jest.fn()

    @withWeapp({
      attached () {
        this.triggerEvent('fork', 'a')
      }
    })
    class A extends TaroComponent {
      componentDidMount () {
        delay(() => {
          expect(spy).toBeCalledWith({
            type: 'fork',
            detail: 'a',
            target: { id: '', dataset: {} },
            currentTarget: { id: '', dataset: {} }
          })
          done()
        })
      }

      render () {
        return <div>{this.data.a}</div>
      }
    }

    @withWeapp({
      fork (...args) {
        spy(...args)
      }
    })
    class B extends TaroComponent {
      render () {
        return <A onFork={this.fork} />
      }
    }

    const root = ReactDOM.createRoot(scratch)
    root.render(<B />)
  })
})
