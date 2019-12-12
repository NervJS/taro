import './polyfill'
import * as React from 'nervjs'
import { Audio } from '../h5'
import { waitForChange } from './utils'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Audio', () => {
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

  it('props', async () => {
    const ref = React.createRef()

    const src = 'src'
    const controls = true
    const loop = true

    /**
     * @type {import('react').ReactInstance}
     */
    let instance

    class App extends React.Component {
      state = {
        src,
        controls,
        loop
      }

      constructor (props) {
        super(props)
        instance = this
      }

      render () {
        return <Audio ref={ref} src={src} controls={controls} loop={loop} />
      }
    }

    React.render(<App />, scratch)

    /**
     * @type {HTMLElement}
     */
    const node = ref.current

    await waitForChange(node)

    /**
     * @type {HTMLAudioElement}
     */
    const audio = node.childNodes[0]
    expect(audio instanceof HTMLAudioElement).toBeTruthy()
    expect(audio.src).toBe(location.origin + '/' + src)
    expect(audio.controls).toBe(controls)
    expect(audio.loop).toBe(loop)

    instance.setState({
      controls: false,
      loop: false
    })
    instance.forceUpdate()

    expect(audio.controls).toBe(true)
    expect(audio.loop).toBe(true)
  })
})
