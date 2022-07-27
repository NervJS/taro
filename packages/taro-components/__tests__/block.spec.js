import React from 'react'
import ReactDOM from 'react-dom'

import { Block } from '../h5/react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Block', () => {
  /**
   * @type {HTMLElement}
   */
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  afterEach(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('有一个空的占位元素，并且 slot 能够使用', async () => {
    class App extends React.Component {
      render () {
        return <Block>
          <div />
          <div />
        </Block>
      }
    }

    ReactDOM.render(<App />, scratch)

    expect(scratch.childNodes.length).toBe(2)
  })
})
