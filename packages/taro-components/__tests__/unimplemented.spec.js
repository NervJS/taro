import React from 'react'
import ReactDOM from 'react-dom'
import { CoverImage, CoverView, MoveableArea, MoveableView, PickerViewColumn } from '../h5/react'
import * as assert from 'assert'
import { waitForChange } from './utils'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('unimplemented', () => {
  /**
   * @type {HTMLElement}
   */
  let scratch

  let warning = ''
  const oldWarn = console.error

  function toCamelCase (s) {
    let camel = ''
    let nextCap = false
    for (let i = 0; i < s.length; i++) {
      if (s[i] !== '-') {
        camel += nextCap ? s[i].toUpperCase() : s[i]
        nextCap = false
      } else {
        nextCap = true
      }
    }
    return camel
  }

  function capitalize (s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  function buildWarning (ref) {
    return `H5 暂不支持 ${capitalize(toCamelCase(ref.current.nodeName.slice(5).toLowerCase()))} 组件！`
  }

  beforeAll(async () => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
    console.error = function () {
      warning = arguments[0]
    }
  })

  beforeEach(async () => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  afterAll(async () => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
    console.error = oldWarn
  })

  it('CoverView', async () => {
    const ref = React.createRef()
    class App extends React.Component {
      render () {
        return <CoverView ref={ref} />
      }
    }

    ReactDOM.render(<App />, scratch)

    await waitForChange(ref.current)

    assert(warning === buildWarning(ref))
  })

  it('CoverImage', async () => {
    const ref = React.createRef()
    class App extends React.Component {
      render () {
        return <CoverImage ref={ref} />
      }
    }

    ReactDOM.render(<App />, scratch)

    await waitForChange(ref.current)

    assert(warning === buildWarning(ref))
  })

  it('MoveableArea', async () => {
    const ref = React.createRef()
    class App extends React.Component {
      render () {
        return <MoveableArea ref={ref} />
      }
    }

    ReactDOM.render(<App />, scratch)

    await waitForChange(ref.current)

    assert(warning === buildWarning(ref))
  })

  it('MoveableView', async () => {
    const ref = React.createRef()
    class App extends React.Component {
      render () {
        return <MoveableView ref={ref} />
      }
    }

    ReactDOM.render(<App />, scratch)

    await waitForChange(ref.current)

    assert(warning === buildWarning(ref))
  })

  it('PickerViewColumn', async () => {
    const ref = React.createRef()
    class App extends React.Component {
      render () {
        return <PickerViewColumn ref={ref} />
      }
    }

    ReactDOM.render(<App />, scratch)

    await waitForChange(ref.current)

    assert(warning === buildWarning(ref))
  })
})
