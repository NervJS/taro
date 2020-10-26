
import * as React from 'react'

let document
let runtime

describe('findDOMNode', () => {
  let render, unmountComponentAtNode, findDOMNode
  beforeAll(() => {
    process.env.FRAMEWORK = 'react'
    runtime = require('@tarojs/runtime')
    const TaroReact = require('../dist/index')
    render = TaroReact.render
    unmountComponentAtNode = TaroReact.unmountComponentAtNode
    findDOMNode = TaroReact.findDOMNode
    document = runtime.document
  })

  afterAll(() => {
    process.env.FRAMEWORK = undefined
  })

  function renderIntoDetachedNode (children) {
    const div = document.createElement('div')
    return render(children, div)
  }

  it('findDOMNode should return null if passed null', () => {
    expect(findDOMNode(null)).toBe(null)
  })

  it('findDOMNode should find dom element', () => {
    class MyNode extends React.Component {
      render () {
        return (
          <div>
            <span>Noise</span>
          </div>
        )
      }
    }

    const myNode = renderIntoDetachedNode(<MyNode />)
    const myDiv = findDOMNode(myNode)
    const mySameDiv = findDOMNode(myDiv)
    expect(myDiv.tagName).toBe('DIV')
    expect(mySameDiv).toBe(myDiv)
  })

  it('findDOMNode should find dom element after an update from null', () => {
    function Bar ({ flag }) {
      if (flag) {
        return <span>A</span>
      }
      return null
    }
    class MyNode extends React.Component {
      render () {
        return <Bar flag={this.props.flag} />
      }
    }

    const container = document.createElement('div')

    const myNodeA = render(<MyNode />, container)
    const a = findDOMNode(myNodeA)
    expect(a).toBe(null)

    const myNodeB = render(<MyNode flag={true} />, container)
    expect(myNodeA === myNodeB).toBe(true)

    const b = findDOMNode(myNodeB)
    expect(b.tagName).toBe('SPAN')
  })

  it('findDOMNode should reject random objects', () => {
    expect(function () {
      findDOMNode({ foo: 'bar' })
    }).toThrowError('Argument appears to not be a ReactComponent. Keys: foo')
  })

  it('findDOMNode should reject unmounted objects with render func', () => {
    class Foo extends React.Component {
      render () {
        return <div />
      }
    }

    const container = document.createElement('div')
    const inst = render(<Foo />, container)
    unmountComponentAtNode(container)

    expect(() => findDOMNode(inst)).toThrowError(
      'Unable to find node on an unmounted component.'
    )
  })

  it('findDOMNode should not throw an error when called within a component that is not mounted', () => {
    class Bar extends React.Component {
      // eslint-disable-next-line react/no-deprecated
      componentWillMount () {
        expect(findDOMNode(this)).toBeNull()
      }

      render () {
        return <div />
      }
    }

    expect(() => renderIntoDetachedNode(<Bar />)).not.toThrow()
  })
})
