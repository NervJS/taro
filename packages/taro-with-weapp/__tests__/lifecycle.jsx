/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react'
import ReactDOM from 'react-dom/client'

import withWeapp from '../src'
import { delay, TaroComponent, wasCalledBefore } from './utils'

const noop = () => {}

describe('lifecycle', () => {
  /**
   * @type {Element} scratch
   */
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
  })

  test('created', done => {
    const spy = jest.fn()

    @withWeapp({
      created () {
        spy()
      }
    })
    class A extends TaroComponent {
      componentDidMount () {
        expect(spy).toBeCalled()
        done()
      }

      render () {
        return <div />
      }
    }

    const root = ReactDOM.createRoot(scratch)
    root.render(<A />)
  })

  test('attached', done => {
    const spy = jest.fn()

    @withWeapp({
      attached () {
        spy()
      }
    })
    class A extends TaroComponent {
      componentDidMount () {
        delay(() => {
          expect(spy).toBeCalled()
          done()
        })
      }

      render () {
        return <div />
      }
    }

    const root = ReactDOM.createRoot(scratch)
    root.render(<A />)
  })

  test('ready should work', done => {
    const s1 = jest.fn()
    const s2 = jest.fn()

    @withWeapp({
      data: {
        a: ''
      },
      created () {
        s1()
        this.a = 'a'
      },
      attached () {
        s2()
      }
    })
    class A extends TaroComponent {
      componentDidMount () {
        delay(() => {
          expect(s1).toBeCalled()
          expect(s2).toBeCalled()
          wasCalledBefore(s1, s2)
          expect(scratch.textContent).toBe('a')
          done()
        })
      }

      render () {
        return <div>{this.a}</div>
      }
    }

    const root = ReactDOM.createRoot(scratch)
    root.render(<A />)
  })

  test('detached', done => {
    const s1 = jest.fn()
    const root = ReactDOM.createRoot(scratch)

    @withWeapp({
      data: {
        a: ''
      },
      detached () {
        s1()
      }
    })
    class A extends TaroComponent {
      componentDidMount () {
        delay(() => root.unmount())
      }

      componentWillUnmount () {
        delay(() => {
          expect(s1).toBeCalledTimes(1)
          done()
        })
      }

      render () {
        return <div>{this.a}</div>
      }
    }

    root.render(<A />)
  })

  test('onUnload', done => {
    const s1 = jest.fn()
    const root = ReactDOM.createRoot(scratch)

    @withWeapp({
      data: {
        a: ''
      },
      onUnload () {
        s1()
      }
    })
    class A extends TaroComponent {
      componentDidMount () {
        delay(() => root.unmount())
      }

      componentWillUnmount () {
        delay(() => {
          expect(s1).toBeCalledTimes(1)
          done()
        })
      }

      render () {
        return <div>{this.a}</div>
      }
    }

    root.render(<A />)
  })

  test('page lifecycle', done => {
    const onLoad = jest.fn()
    const onReady = jest.fn()
    const onUnload = jest.fn()
    const root = ReactDOM.createRoot(scratch)

    @withWeapp({
      data: {
        a: ''
      },
      created () {
        onLoad()
      },
      attached () {
        onReady()
      },
      onUnload () {
        onUnload()
      }
    })
    class A extends TaroComponent {
      componentDidMount () {
        delay(() => root.unmount())
      }

      componentWillUnmount () {
        delay(() => {
          expect(onLoad).toBeCalledTimes(1)
          expect(onReady).toBeCalledTimes(1)
          expect(onUnload).toBeCalledTimes(1)

          wasCalledBefore(onLoad, onReady)
          wasCalledBefore(onReady, onUnload)
          done()
        })
      }

      render () {
        return <div>{this.a}</div>
      }
    }

    root.render(<A />)
  })

  test('component lifecycle', done => {
    const created = jest.fn()
    const ready = jest.fn()
    const detached = jest.fn()
    const root = ReactDOM.createRoot(scratch)

    @withWeapp({
      data: {
        a: ''
      },
      created () {
        created()
      },
      attached () {
        ready()
      },
      detached () {
        detached()
      }
    })
    class A extends TaroComponent {
      componentDidMount () {
        delay(() => root.unmount())
      }

      componentWillUnmount () {
        delay(() => {
          expect(created).toBeCalledTimes(1)
          expect(ready).toBeCalledTimes(1)
          expect(detached).toBeCalledTimes(1)

          wasCalledBefore(created, ready)
          wasCalledBefore(ready, detached)
          done()
        })
      }

      render () {
        return <div>{this.a}</div>
      }
    }

    root.render(<A />)
  })

  test('created should emit this.$router.params as aruguments', done => {
    const spy = jest.fn()

    @withWeapp({
      created (options) {
        spy(options)
      }
    })
    class A extends TaroComponent {
      componentDidMount () {
        delay(() => {
          expect(spy).toBeCalledWith({})
          done()
        })
      }

      render () {
        return <div />
      }
    }

    const root = ReactDOM.createRoot(scratch)
    root.render(<A />)
  })
})
