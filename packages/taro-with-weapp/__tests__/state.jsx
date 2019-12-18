/** @jsx createElement */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement, render } from 'nervjs'
import withWeapp from '../src'
import { TaroComponent, delay } from './utils'
import * as sinon from 'sinon'

describe('state', () => {
  /**
   * @type {Element} scratch
   */
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
  })

  test('observer can trigger', (done) => {
    const spy = sinon.spy()
    @withWeapp({
      data: {
        a: 'a'
      },
      observers: {
        'a': function (a) {
          spy(a)
        }
      },
      onLoad () {
        this.setData({
          a: 'b'
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
      expect(spy.calledWith('b')).toBeTruthy()
      done()
    })
  })

  test('observer can trigger two value', (done) => {
    const spy = sinon.spy()
    @withWeapp({
      data: {
        a: 'a',
        b: 'b'
      },
      observers: {
        'a, b': function (a, b) {
          spy(a, b)
        }
      },
      onLoad () {
        this.setData({
          a: 'aa',
          b: 'bb'
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
      expect(spy.calledWith('aa', 'bb')).toBeTruthy()
      done()
    })
  })

  test('observer can trigger deep level', (done) => {
    const spy = sinon.spy()
    @withWeapp({
      data: {
        a: {
          b: 'a.b'
        }
      },
      observers: {
        'a.b': function (a, b) {
          spy(a, b)
        }
      },
      onLoad () {
        this.setData({
          'a.b': 'b.a'
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
      expect(spy.calledWith('b.a')).toBeTruthy()
      done()
    })
  })

  test('observer can trigger by change array value', (done) => {
    const spy = sinon.spy()
    @withWeapp({
      data: {
        a: {
          b: [1, 2, 3, 4]
        }
      },
      observers: {
        'a.b[0]': function (a, b) {
          spy(a, b)
        }
      },
      onLoad () {
        this.setData({
          'a': {
            b: [0]
          }
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
      expect(spy.calledWith(0)).toBeTruthy()
      done()
    })
  })

  test('observer can trigger by change array value 2', (done) => {
    const spy = sinon.spy()
    @withWeapp({
      data: {
        b: [1, 2, 3, 4]
      },
      observers: {
        'b[0]': function (a, b) {
          spy(a, b)
        }
      },
      onLoad () {
        this.setData({
          b: [0]
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
      expect(spy.calledWith(0)).toBeTruthy()
      done()
    })
  })

  test('observer can trigger like weixin mini app awkward behavior', (done) => {
    const spy = sinon.spy()
    @withWeapp({
      data: {
        a: {
          b: 'a.b'
        }
      },
      observers: {
        'a.b': function (a, b) {
          spy(a, b)
        }
      },
      onLoad () {
        this.setData({
          a: {
            b: 'b',
            c: 'cc'
          }
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
      expect(spy.calledWith('b')).toBeTruthy()
      done()
    })
  })

  test('observer can trigger like weixin mini app awkward behavior 2', (done) => {
    const spy = sinon.spy()
    @withWeapp({
      data: {
        a: {
          b: 'a.b'
        }
      },
      observers: {
        'a.b': function (a, b) {
          spy(a, b)
        }
      },
      onLoad () {
        this.setData({
          a: {
            c: 'cc'
          }
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
      expect(spy.calledWith(null)).toBeTruthy()
      done()
    })
  })

  test('observer can trigger in multiple observers', (done) => {
    const spy = sinon.spy()
    const spy2 = sinon.spy()

    @withWeapp({
      data: {
        a: 'a',
        b: 'b'
      },
      observers: {
        'a': function (a) {
          spy(a)
        },
        'b': function (a) {
          spy2(a)
        }
      },
      onLoad () {
        this.setData({
          a: 'aa'
        })
      }
    })
    class A extends TaroComponent {
      componentDidMount () {
        this.setData({
          b: 'bb'
        })
      }
      render () {
        return <div>{this.a}</div>
      }
    }

    render(<A />, scratch)

    delay(() => {
      expect(spy.callCount).toBe(1)
      expect(spy2.callCount).toBe(1)
      done()
    })
  })

  test('state can destruct from this', (done) => {
    @withWeapp({
      data: {
        a: 'a'
      }
    })
    class A extends TaroComponent {
      render () {
        return <div>{this.a}</div>
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
      ready () {
        this.setData({
          a: 'b'
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
      ready () {
        this.setData({
          'a.b': 'b'
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
      expect(scratch.textContent).toBe('b')
      done()
    })
  })

  test('state can be changed even not init data is provided', (done) => {
    @withWeapp({
      data: {
      },
      ready () {
        this.setData({
          'a': 'b'
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
