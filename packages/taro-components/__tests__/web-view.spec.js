import * as assert from 'assert'
import React from 'react'
import * as sinon from 'sinon'

import { WebView } from '../h5/react'
import { mount } from './test-tools'
import { delay } from './utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('WebView', () => {
  /**
   * @type {HTMLElement}
   */
  let scratch

  const TARO = 'https://taro.jd.com/home/in.html'

  beforeEach(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  afterEach(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('should show an iframe', async () => {
    const wrapper = await mount(<WebView src={TARO} />, scratch)
    const iframe = wrapper.find('iframe')

    assert(iframe.src === TARO)
  })

  it('events', async () => {
    const onLoad = sinon.spy()
    await mount(<WebView src='' onLoad={onLoad} />, scratch)

    await delay(30)
    assert(onLoad.callCount === 1)
  })
})
