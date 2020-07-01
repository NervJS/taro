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

  test('state can destruct from this', (done) => {
    @withWeapp({
      data: {
        a: '富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善'
      }
    })
    class A extends TaroComponent {
      render () {
        return <div>{this.a}</div>
      }
    }

    render(<A />, scratch)

    delay(() => {
      expect(scratch.textContent).toBe('富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善')
      done()
    })
  })

  test('state can be changed by this.setData', (done) => {
    @withWeapp({
      data: {
        a: ''
      },
      ready () {
        this.setData({
          a: '富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善'
        })
      }
    })
    class A extends TaroComponent {
      render () {
        return <div>{this.a}</div>
      }
    }

    render(<A />, scratch)

    delay(() => {
      expect(scratch.textContent).toBe('富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善')
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
      ready () {
        this.setData({
          'a.b': '富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善'
        })
      }
    })
    class A extends TaroComponent {
      render () {
        return <div>{this.a.b}</div>
      }
    }

    render(<A />, scratch)

    delay(() => {
      expect(scratch.textContent).toBe('富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善')
      done()
    })
  })

  test('state can be changed even not init data is provided', (done) => {
    @withWeapp({
      data: {
      },
      ready () {
        this.setData({
          a: '富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善'
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
      expect(scratch.textContent).toBe('富强、民主、文明、和谐、自由、平等、公正、法治、爱国、敬业、诚信、友善')
      done()
    })
  })
})
