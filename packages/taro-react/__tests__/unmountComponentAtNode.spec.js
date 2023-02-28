import * as React from 'react'

let document
let runtime

describe('unmountComponentAtNode', () => {
  let render, unmountComponentAtNode, batchedUpdates
  beforeAll(() => {
    process.env.FRAMEWORK = 'react'
    runtime = require('@tarojs/runtime')
    const TaroReact = require('../dist/index')
    render = TaroReact.render
    unmountComponentAtNode = TaroReact.unmountComponentAtNode
    batchedUpdates = TaroReact.unstable_batchedUpdates
    document = runtime.document
  })

  afterAll(() => {
    process.env.FRAMEWORK = undefined
  })

  it('throws when given a non-node', () => {
    expect(function () {
      unmountComponentAtNode(null)
    }).toThrowError(
      'unmountComponentAtNode(...): Target container is not a DOM element.'
    )
  })

  it('returns false on non-React containers', () => {
    const d = document.createElement('div')
    d.id = 'test'
    expect(unmountComponentAtNode(d)).toBe(false)
    expect(d.id).toBe('test')
  })

  it('returns true on React containers', () => {
    const d = document.createElement('div')
    render(<b>hellooo</b>, d)

    expect(d.textContent).toBe('hellooo')
    expect(unmountComponentAtNode(d)).toBe(true)
    expect(d.textContent).toBe('')
  })

  it('should render different components in same root', () => {
    const container = document.createElement('container')

    render(<div />, container)
    expect(container.firstChild.tagName).toBe('DIV')

    render(<span />, container)
    expect(container.firstChild.tagName).toBe('SPAN')
  })

  it('should unmount and remount if the key changes', () => {
    const container = document.createElement('container')

    const mockMount = jest.fn()
    const mockUnmount = jest.fn()

    class Component extends React.Component {
      componentDidMount = mockMount
      componentWillUnmount = mockUnmount
      render () {
        return <span>{this.props.text}</span>
      }
    }

    expect(mockMount.mock.calls.length).toBe(0)
    expect(mockUnmount.mock.calls.length).toBe(0)

    render(<Component text="orange" key="A" />, container)
    expect(container.firstChild.textContent).toBe('orange')
    expect(mockMount.mock.calls.length).toBe(1)
    expect(mockUnmount.mock.calls.length).toBe(0)

    // If we change the key, the component is unmounted and remounted
    render(<Component text="green" key="B" />, container)
    expect(container.firstChild.textContent).toBe('green')
    expect(mockMount.mock.calls.length).toBe(2)
    expect(mockUnmount.mock.calls.length).toBe(1)

    // But if we don't change the key, the component instance is reused
    render(<Component text="blue" key="B" />, container)
    expect(container.firstChild.textContent).toBe('blue')
    expect(mockMount.mock.calls.length).toBe(2)
    expect(mockUnmount.mock.calls.length).toBe(1)
  })

  it('should reuse markup if rendering to the same target twice', () => {
    const container = document.createElement('container')
    const instance1 = render(<div />, container)
    const instance2 = render(<div />, container)

    expect(instance1 === instance2).toBe(true)
  })

  it.skip('initial mount is sync inside batchedUpdates, but task work is deferred until the end of the batch', () => {
    const container1 = document.createElement('div')
    const container2 = document.createElement('div')

    class Foo extends React.Component {
      state = { active: false }
      componentDidMount () {
        this.setState({ active: true })
      }

      render () {
        return (
          <div>{this.props.children + (this.state.active ? '!' : '')}</div>
        )
      }
    }

    render(<Foo>a</Foo>, container2)

    batchedUpdates(() => {
      // Update. Does not flush yet.
      render(<div>2</div>, container1)
      expect(container1.textContent).toEqual('1')

      // Initial mount on another root. Should flush immediately.
      render(<Foo>a</Foo>, container2)
      // The update did not flush yet.
      expect(container1.textContent).toEqual('1')
      // The initial mount flushed, but not the update scheduled in cDU.
      expect(container2.textContent).toEqual('a')
    })
    // All updates have flushed.
    expect(container1.textContent).toEqual('2')
    expect(container2.textContent).toEqual('a!')
  })
})
