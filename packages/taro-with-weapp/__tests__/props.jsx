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

/** @jsx createElement */
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement, render } from 'nervjs'

import withWeapp from '../src'
import { delay,TaroComponent } from './utils'

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
