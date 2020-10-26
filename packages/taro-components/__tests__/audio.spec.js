import './polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Audio } from '../h5/react'
import { waitForChange } from './utils'
import * as assert from 'assert'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Audio', () => {
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

  it('props', async () => {
    const ref = React.createRef()

    const src = 'http://storage.jd.com/cjj-pub-images/horse.ogv'
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
        const {
          src,
          controls,
          loop
        } = this.state
        return <Audio ref={ref} src={src} controls={controls} loop={loop} />
      }
    }

    ReactDOM.render(<App />, scratch)

    /**
     * @type {HTMLElement}
     */
    const node = ref.current

    await waitForChange(node)

    /**
     * @type {HTMLAudioElement}
     */
    const audio = node.childNodes[0]
    assert(audio instanceof HTMLAudioElement)
    assert(audio.src === src)
    assert(audio.controls === controls)
    assert(audio.loop === loop)

    instance.setState({
      controls: false,
      loop: false
    })
    await waitForChange(audio)
    assert(audio.controls === false)
    assert(audio.loop === false)
  })
})
