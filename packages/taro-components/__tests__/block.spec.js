import React from 'react'
import ReactDOM from 'react-dom'
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
    const ref = React.createRef()

    class App extends React.Component {
      render () {
        return <Block ref={ref}>
          <div />
          <div />
        </Block>
      }
    }

    ReactDOM.render(<App />, scratch)

    /**
     * @type {HTMLElement}
     */
    const node = ref.current

    await waitForChange(node)

    expect(scratch.childNodes.length).toBe(1)
    expect(node.childNodes.length).toBe(2)
  })
})
