import * as React from 'nervjs'
import { Block } from '../h5'
import { waitForChange } from './utils'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Block', () => {
  /**
   * @type {HTMLElement}
   */
  let scratch

  beforeAll(async () => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  beforeEach(async () => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  afterAll(async () => {
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

    React.render(<App />, scratch)

    /**
     * @type {HTMLElement}
     */
    const node = ref.current

    await waitForChange(node)

    expect(scratch.childNodes.length).toBe(1)
    expect(node.childNodes.length).toBe(2)
  })
})
