import React from 'react'
import ReactDOMClient from 'react-dom/client'

import { Block } from '../h5/react'
import { waitForChange } from './utils'

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

    ReactDOMClient.createRoot(scratch).render(<App />)

    await waitForChange(scratch)

    expect(scratch.childNodes.length).toBe(2)
  })
})
