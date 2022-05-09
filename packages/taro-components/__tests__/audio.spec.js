import * as assert from 'assert'
import React from 'react'

import { Audio } from '../h5/react'
import { mount } from './test-tools'
import { delay, waitForChange } from './utils'
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
    const src = 'http://storage.jd.com/cjj-pub-images/horse.ogv'
    const controls = true
    const loop = true

    class App extends React.Component {
      constructor () {
        super(...arguments)
        this.state = {
          src,
          controls,
          loop
        }
      }

      render () {
        const {
          src,
          controls,
          loop
        } = this.state
        return (
          <Audio src={src} controls={controls} loop={loop} />
        )
      }
    }

    const wrapper = await mount(<App />, scratch)
    const node = wrapper.node
    await waitForChange(node)

    if (!node.firstElementChild) await delay(3000)

    const audio = node.firstElementChild

    assert(audio instanceof HTMLAudioElement)
    assert(audio.src === src)
    assert(audio.controls === controls)
    assert(audio.loop === loop)

    await wrapper.setState({
      controls: false,
      loop: false
    })

    assert(audio.controls === false)
    assert(audio.loop === false)
  })
})
