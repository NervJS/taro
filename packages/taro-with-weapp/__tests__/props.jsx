/** @jsx createElement */
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement, render } from 'nervjs'
import withWeapp from '../src'
import { TaroComponent, delay } from './utils'

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
      render () {
        return <A a='b' />
      }
    }

    render(<B />, scratch)

    delay(() => {
      expect(scratch.textContent).toBe('b')
      done()
    })
  })

  test('observer should emit in first render', () => {
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
      render () {
        return <A a='b' />
      }
    }

    render(<B />, scratch)

    expect(scratch.textContent).toBe('b')
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith('b', 'b')
  })

  test('observer should work', () => {
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

    let inst

    @withWeapp({
      data: {
        a: 'a'
      }
    })
    class B extends TaroComponent {
      constructor (props) {
        super(props)
        inst = this
      }

      render () {
        return <A a={this.data.a} />
      }
    }

    render(<B />, scratch)

    expect(scratch.textContent).toBe('a')
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith('a', 'a')

    inst.setData({ a: 'b' })
    inst.forceUpdate()
    expect(spy).toBeCalledWith('b', 'a')
  })

  test('trigger event should work', () => {
    const spy = jest.fn()

    @withWeapp({
      ready () {
        this.triggerEvent('fork', 'a', 'b', 'c')
      }
    })
    class A extends TaroComponent {
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

    render(<B />, scratch)

    expect(spy).toBeCalledWith(...['a', 'b', 'c'].map(s => ({ detail: s })))
  })
})
