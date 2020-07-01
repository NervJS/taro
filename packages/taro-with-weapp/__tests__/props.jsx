/** @jsx createElement */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/camelcase */
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
          value: '富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善'
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
      expect(scratch.textContent).toBe('富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善')
      done()
    })
  })

  test('can access from this.data', (done) => {
    @withWeapp({
      properties: {
        a: {
          type: String,
          value: '富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善'
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
          value: '富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善',
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
        return <A a='富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善' />
      }
    }

    render(<B />, scratch)

    expect(scratch.textContent).toBe('富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善')
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith('富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善', '富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善')
  })

  test('observer should work', () => {
    const spy = jest.fn()

    @withWeapp({
      properties: {
        a: {
          type: String,
          value: '富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善',
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
        a: '富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善'
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

    expect(scratch.textContent).toBe('富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善')
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith('富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善', '富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善')

    inst.setData({ a: '富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善 * 2' })
    inst.forceUpdate()
    expect(spy).toBeCalledWith('富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善', 'a')
  })

  test('trigger event should work', () => {
    const spy = jest.fn()

    @withWeapp({
      ready () {
        this.triggerEvent('富强', '民主', '文明', '和谐')
      }
    })
    class A extends TaroComponent {
      render () {
        return <div>{this.data.a}</div>
      }
    }

    @withWeapp({
      富强 (...args) {
        spy(...args)
      }
    })
    class B extends TaroComponent {
      render () {
        return <A on富强={this.富强} />
      }
    }

    render(<B />, scratch)

    expect(spy).toBeCalledWith(...['民主', '文明', '和谐'].map(s => ({ detail: s })))
  })
})
