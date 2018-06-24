import Nerv, { Component, render } from 'nervjs'
import * as mobx from 'mobx'
import createClass from 'nerv-create-class'
import { inject, observer, Observer, trackComponents, useStaticRendering } from '../src/index'
import { sleepHelper } from './utils'

const store = mobx.observable({
  todos: [
    {
      title: 'a',
      completed: false
    }
  ]
})

let todoItemRenderings = 0
const TodoItem = observer(function TodoItem (props) {
  todoItemRenderings++
  return <li>|{props.todo.title}</li>
})

let todoListRenderings = 0
let todoListWillReactCount = 0
const TodoList = observer(
  createClass({
    renderings: 0,
    componentWillReact () {
      todoListWillReactCount++
    },
    render () {
      todoListRenderings++
      const todos = store.todos
      return (
        <div>
          <hi>{todos.length}</hi>
          {todos.map((todo, idx) => <TodoItem key={idx} todo={todo} />)}
        </div>
      )
    }
  })
)

const App = () => <TodoList />

const getDNode = (obj, prop) => mobx._getAdministration(obj, prop)

describe('Mobx Observer', () => {
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

  trackComponents()

  it('nestedRendering', done => {
    render(<App />, container)
    expect(todoListRenderings).toEqual(1) //, 'should have rendered list once');
    expect(todoListWillReactCount).toEqual(0) //, 'should not have reacted yet')
    expect(container.querySelectorAll('li').length).toEqual(1)
    expect(container.querySelector('li').textContent).toEqual('|a')

    expect(todoItemRenderings).toEqual(1) // 'item1 should render once'

    expect(getDNode(store, 'todos').observers.size).toBe(1)
    expect(getDNode(store.todos[0], 'title').observers.size).toBe(1)

    store.todos[0].title += 'a'

    setTimeout(() => {
      expect(todoListRenderings).toEqual(1) //, 'should have rendered list once');
      expect(todoListWillReactCount).toEqual(0) //, 'should not have reacted')
      expect(todoItemRenderings).toEqual(2) //, 'item1 should have rendered twice');
      expect(getDNode(store, 'todos').observers.size).toBe(1) //, 'observers count shouldn\'t change');
      expect(getDNode(store.todos[0], 'title').observers.size).toBe(1) //, 'title observers should not have increased');

      store.todos.push({
        title: 'b',
        completed: true
      })

      setTimeout(() => {
        expect(container.querySelectorAll('li').length).toBe(2) //, 'list should two items in in the list');
        const expectedOutput = []
        const nodes = container.querySelectorAll('li')

        for (let i = 0; i < nodes.length; i++) {
          expectedOutput.push(nodes[i].textContent)
        }
        expect(expectedOutput).toEqual(['|aa', '|b'])

        expect(todoListRenderings).toBe(2) // 'should have rendered list twice');
        expect(todoListWillReactCount).toBe(1) //, 'should have reacted')
        expect(todoItemRenderings).toBe(3) //, 'item2 should have rendered as well');
        expect(getDNode(store.todos[1], 'title').observers.size).toBe(1) //, 'title observers should have increased');
        expect(getDNode(store.todos[1], 'completed').observers.size).toBe(0) //, 'completed observers should not have increased');

        const oldTodo = store.todos.pop()
        setTimeout(() => {
          expect(todoListRenderings).toBe(3) //, 'should have rendered list another time');
          expect(todoListWillReactCount).toBe(2) //, 'should have reacted')
          expect(todoItemRenderings).toBe(3) //, 'item1 should not have rerendered');
          expect(container.querySelectorAll('li').length).toBe(1) //, 'list should have only on item in list now');
          expect(getDNode(oldTodo, 'title').observers.size).toBe(0) //, 'title observers should have decreased');
          expect(getDNode(oldTodo, 'completed').observers.size).toBe(0) //, 'completed observers should not have decreased');

          done()
        })
      }, 100)
    }, 100)
  })

  it('keep views alive', done => {
    let yCalcCount = 0
    const data = mobx.observable({
      x: 3,
      get y () {
        yCalcCount++
        return this.x * 2
      },
      z: 'hi'
    })

    const TestComponent = observer(function testComponent () {
      return (
        <div>
          {data.z}
          {data.y}
        </div>
      )
    })

    render(<TestComponent />, container)
    expect(yCalcCount).toBe(1)
    expect(container.textContent).toBe('hi6')

    data.z = 'hello'
    // test: rerender should not need a recomputation of data.y because the subscription is kept alive

    setTimeout(() => {
      expect(yCalcCount).toBe(1)

      expect(container.textContent).toBe('hello6')
      expect(yCalcCount).toBe(1)

      expect(getDNode(data, 'y').observers.size).toBe(1)

      render(<div />, container)

      expect(getDNode(data, 'y').observers.size).toBe(0)
      done()
    }, 100)
  })

  it('componentWillMount from mixin is run first', done => {
    let origRenderMethod
    const clss = createClass({
      componentWillMount: function () {
        // ugly check, but proofs that observer.willmount has run
        // We cannot use function.prototype.name here like in react-redux tests because it is not supported in Edge/IE
        expect(this.render).not.toBe(origRenderMethod)
      },
      render () {
        return null
      }
    })
    origRenderMethod = clss.prototype.render

    const Comp = observer(clss)
    render(<Comp />, container)
    done()
  })

  it('does not views alive when using static rendering', done => {
    useStaticRendering(true)

    let renderCount = 0
    const data = mobx.observable({
      z: 'hi'
    })

    const TestComponent = observer(function testComponent () {
      renderCount++
      return <div>{data.z}</div>
    })

    render(<TestComponent />, container)

    expect(renderCount).toBe(1)
    expect(container.querySelector('div').textContent).toBe('hi')

    data.z = 'hello'
    // no re-rendering on static rendering

    setTimeout(() => {
      expect(renderCount).toBe(1)

      expect(container.querySelector('div').textContent).toBe('hi')
      expect(renderCount).toBe(1)

      expect(getDNode(data, 'z').observers.size).toBe(0)

      useStaticRendering(false)
      done()
    }, 100)
  })

  it('issue 12', function (done) {
    const data = mobx.observable({
      selected: 'coffee',
      items: [
        {
          name: 'coffee'
        },
        {
          name: 'tea'
        }
      ]
    })

    /** Row Class */
    class Row extends Component {
      constructor (props) {
        super(props)
      }

      render () {
        return (
          <span>
            {this.props.item.name}
            {data.selected === this.props.item.name ? '!' : ''}
          </span>
        )
      }
    }

    /** table stateles component */
    const Table = observer(function table () {
      return <div>{data.items.map(item => <Row key={item.name} item={item} />)}</div>
    })

    render(<Table />, container)

    expect(container.querySelector('div').textContent).toBe('coffee!tea')

    mobx.runInAction(() => {
      data.items[1].name = 'boe'
      data.items.splice(0, 2, { name: 'soup' })
      data.selected = 'tea'
    })

    setTimeout(() => {
      expect(container.querySelector('div').textContent).toBe('soup')
      done()
    }, 50)
  })

  it('component should not be inject', function (done) {
    const msg = []
    const baseWarn = console.warn
    console.warn = m => msg.push(m)

    observer(
      inject('foo')(
        createClass({
          render () {
            return <div>context:{this.props.foo}</div>
          }
        })
      )
    )

    expect(msg.length).toBe(1)
    console.warn = baseWarn
    done()
  })

  it('observer component can be injected', done => {
    const msg = []
    const baseWarn = console.error
    console.error = m => msg.push(m)

    inject('foo')(
      observer(
        createClass({
          render: () => null
        })
      )
    )

    // N.B, the injected component will be observer since mobx-react 4.0!
    inject(() => {})(
      observer(
        createClass({
          render: () => null
        })
      )
    )

    expect(msg.length).toBe(0)
    console.error = baseWarn
    done()
  })

  it('124 - react to changes in this.props via computed', function (done) {
    const Comp = observer(
      createClass({
        componentWillMount () {
          mobx.extendObservable(this, {
            get computedProp () {
              return this.props.x
            }
          })
        },
        render () {
          return <span>x:{this.computedProp}</span>
        }
      })
    )

    const Parent = createClass({
      getInitialState () {
        return { v: 1 }
      },
      render () {
        return (
          <div onClick={() => this.setState({ v: 2 })}>
            <Comp x={this.state.v} />
          </div>
        )
      }
    })

    render(<Parent />, container)

    expect(container.querySelector('span').textContent).toBe('x:1')
    container.querySelector('div').click()
    setTimeout(() => {
      expect(container.querySelector('span').textContent).toBe('x:2')
      done()
    }, 100)
  })

  it('should render component even if setState called with exactly the same props', async (done) => {
    let renderCount = 0
    const Component = observer(
      createClass({
        onClick () {
          this.setState({})
        },
        render () {
          renderCount++
          return <div onClick={this.onClick} id='clickableDiv' />
        }
      })
    )
    render(<Component />, container)

    expect(renderCount).toBe(1) // 'renderCount === 1');
    container.querySelector('#clickableDiv').click()
    await sleepHelper(100)
    expect(renderCount).toBe(2) // 'renderCount === 2');
    container.querySelector('#clickableDiv').click()
    await sleepHelper(100)
    expect(renderCount).toBe(3) // 'renderCount === 3');
    done()
  })

  it('Observer regions should react', async (done) => {
    const data = mobx.observable.box('hi')
    const Comp = () => (
      <div>
        <Observer>{() => <span>{data.get()}</span>}</Observer>
        <li>{data.get()}</li>
      </div>
    )
    render(<Comp />, container)

    expect(container.querySelector('span').textContent).toBe('hi')
    expect(container.querySelector('li').textContent).toBe('hi')

    data.set('hello')
    await sleepHelper(100)
    expect(container.querySelector('span').textContent).toBe('hello')
    expect(container.querySelector('li').textContent).toBe('hi')
    done()
  })

  it('Observer should not re-render on shallow equal new props', done => {
    let childRendering = 0
    let parentRendering = 0
    const data = { x: 1 }
    const odata = mobx.observable({ y: 1 })

    const Child = observer(({ data }) => {
      childRendering++
      return <span>{data.x}</span>
    })
    const Parent = observer(() => {
      parentRendering++
      odata.y /// depend
      return <Child data={data} />
    })

    render(<Parent />, container)
    expect(parentRendering).toBe(1)
    expect(childRendering).toBe(1)
    expect(container.querySelector('span').textContent).toBe('1')

    odata.y++
    setTimeout(() => {
      expect(parentRendering).toBe(2)
      expect(childRendering).toBe(1)
      expect(container.querySelector('span').textContent).toBe('1')
      done()
    }, 20)
  })
})
