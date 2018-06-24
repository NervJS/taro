import Nerv, { render } from 'nervjs'
import createClass from 'nerv-create-class'
import * as mobx from 'mobx'
import { inject, observer, Provider } from '../src/index'
import { sleepHelper } from './utils'

describe('inject based context', () => {
  let container

  beforeEach(function () {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(function () {
    render(null, container)
    container.innerHTML = ''
    document.body.removeChild(container)
  })

  it('basic context', done => {
    const C = inject('foo')(
      observer(
        createClass({
          render () {
            return <div>context:{this.props.foo}</div>
          }
        })
      )
    )
    const B = () => <C />
    const A = () => (
      <Provider foo='bar'>
        <B />
      </Provider>
    )
    render(<A />, container)
    expect(container.querySelector('div').textContent).toBe('context:bar')
    done()
  })

  it('props override context', done => {
    const C = inject('foo')(
      createClass({
        render () {
          return <div>context:{this.props.foo}</div>
        }
      })
    )
    const B = () => <C foo={42} />
    const A = createClass({
      render: () => (
        <Provider foo='bar'>
          <B />
        </Provider>
      )
    })
    render(<A />, container)
    expect(container.querySelector('div').textContent).toBe('context:42')
    done()
  })

  it('overriding stores is supported', done => {
    const C = inject('foo', 'bar')(
      observer(
        createClass({
          render () {
            return (
              <div>
                context:{this.props.foo}
                {this.props.bar}
              </div>
            )
          }
        })
      )
    )
    const B = () => <C />
    const A = createClass({
      render: () => (
        <Provider foo='bar' bar={1337}>
          <div>
            <span>
              <B />
            </span>
            <section>
              <Provider foo={42}>
                <B />
              </Provider>
            </section>
          </div>
        </Provider>
      )
    })
    render(<A />, container)
    expect(container.querySelector('span').textContent).toBe('context:bar1337')
    expect(container.querySelector('section').textContent).toBe('context:421337')
    done()
  })

  it('store should be available', done => {
    const C = inject('foo')(
      observer(
        createClass({
          render () {
            return <div>context:{this.props.foo}</div>
          }
        })
      )
    )
    const B = () => <C />
    const A = createClass({
      render: () => (
        <Provider baz={42}>
          <B />
        </Provider>
      )
    })

    try {
      render(<A />, container)
    } catch (e) {
      expect(e.message).toBe("MobX injector: Store 'foo' is not available! Make sure it is provided by some Provider")
      done()
    }
  })

  it('store is not required if prop is available', done => {
    const C = inject('foo')(
      observer(
        createClass({
          render () {
            return <div>context:{this.props.foo}</div>
          }
        })
      )
    )
    const B = () => <C foo='bar' />
    render(<B />, container)
    expect(container.querySelector('div').textContent).toBe('context:bar')
    done()
  })

  it('custom storesToProps', done => {
    const C = inject((stores, props, context) => {
      expect(context).toEqual({ mobxStores: { foo: 'bar' } })
      expect(stores).toEqual({ foo: 'bar' })
      expect(props).toEqual({ baz: 42, children: [] })

      return {
        zoom: stores.foo,
        baz: props.baz * 2
      }
    })(
      observer(
        createClass({
          render () {
            return (
              <div>
                context:{this.props.zoom}
                {this.props.baz}
              </div>
            )
          }
        })
      )
    )
    const B = createClass({
      render: () => <C baz={42} />
    })
    const A = () => (
      <Provider foo='bar'>
        <B />
      </Provider>
    )
    render(<A />, container)
    expect(container.querySelector('div').textContent).toBe('context:bar84')
    done()
  })

  it('support static hoisting, wrappedComponent and wrappedInstance', done => {
    const B = createClass({
      render () {
        this.testField = 1
        return <div>{this.testField}</div>
      }
    })
    B.bla = 17
    B.bla2 = {}
    const C = inject('booh')(B)

    expect(C.wrappedComponent).toBe(B)
    expect(B.bla).toBe(17)
    expect(C.bla).toBe(17)

    let c = null
    render(<C ref={i => (c = i)} booh={42} />, container)
    expect(c.wrappedInstance.testField).toBe(1)
    done()
  })

  it('propTypes and defaultProps are forwarded', done => {
    const msg = []
    const baseError = console.error
    console.error = m => msg.push(m)

    const C = inject(['foo'])(
      createClass({
        displayName: 'C',
        render () {
          expect(this.props.y).toBe(3)
          return null
        }
      })
    )
    C.defaultProps = {
      y: 3
    }
    const B = () => <C z='test' />
    const A = () => (
      <Provider foo='bar'>
        <B />
      </Provider>
    )
    render(<A />, container)
    expect(msg.length).toBe(0)
    console.error = baseError
    done()
  })

  it('using a custom injector is reactive', async (done) => {
    const user = mobx.observable({ name: 'Noa' })
    const mapper = stores => ({ name: stores.user.name })
    const DisplayName = props => <h1>{props.name}</h1>
    const User = inject(mapper)(DisplayName)
    const App = () => (
      <Provider user={user}>
        <User />
      </Provider>
    )
    render(<App />, container)

    expect(container.querySelector('h1').textContent).toBe('Noa')

    user.name = 'Veria'
    await sleepHelper(100)
    expect(container.querySelector('h1').textContent).toBe('Veria')
    done()
  })
})
