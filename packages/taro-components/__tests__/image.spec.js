import React from 'react'
import * as assert from 'assert'
import * as sinon from 'sinon'
import { Image } from '../h5/react'
import { mount } from './test-tools'
import { delay } from './utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Image', () => {
  /**
   * @type {HTMLElement}
   */
  let scratch

  const IMAGE = 'http://storage.jd.com/cjj-pub-images/cat.jpg'

  beforeEach(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  afterEach(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('should show an image', async () => {
    const wrapper = await mount(<Image src={IMAGE} />, scratch)

    assert(wrapper.find(`img[src='${IMAGE}']`))
  })

  it('should set mode successfully', async () => {
    const wrapper = await mount(<Image src={IMAGE} />, scratch)
    const { node } = wrapper
    let mode = 'scaleToFill'
    const img = node.querySelector('img')

    assert(node.mode === mode)
    assert(img.classList.contains('taro-img__mode-scaletofill') === true)

    mode = 'aspectFit'
    await wrapper.setProps({ mode })
    assert(node.mode === mode)
    assert(img.classList.contains('taro-img__mode-aspectfit') === true)

    mode = 'aspectFill'
    await wrapper.setProps({ mode })
    assert(node.mode === mode)
    assert(img.classList.contains('taro-img__mode-aspectfill') === true)
    // 无头浏览器中获取不到 naturalWidth 和 naturalHeight
    // const { naturalWidth, naturalHeight } = img
    // const aspectFillMode = naturalWidth > naturalHeight ? 'width' : 'height'
    // assert(img.classList.contains(`taro-img__mode-aspectfill--${aspectFillMode}`) === true)

    mode = 'widthFix'
    await wrapper.setProps({ mode })
    assert(node.mode === mode)
    assert(node.classList.contains('taro-img__widthfix'))
    assert(img.classList.contains('taro-img__mode-widthfix') === true)

    mode = 'top'
    await wrapper.setProps({ mode })
    assert(node.mode === mode)
    assert(img.classList.contains('taro-img__mode-top') === true)

    mode = 'bottom'
    await wrapper.setProps({ mode })
    assert(node.mode === mode)
    assert(img.classList.contains('taro-img__mode-bottom') === true)

    mode = 'center'
    await wrapper.setProps({ mode })
    assert(node.mode === mode)
    assert(img.classList.contains('taro-img__mode-center') === true)

    mode = 'left'
    await wrapper.setProps({ mode })
    assert(node.mode === mode)
    assert(img.classList.contains('taro-img__mode-left') === true)

    mode = 'right'
    await wrapper.setProps({ mode })
    assert(node.mode === mode)
    assert(img.classList.contains('taro-img__mode-right') === true)

    mode = 'top left'
    await wrapper.setProps({ mode })
    assert(node.mode === mode)
    assert(img.classList.contains('taro-img__mode-topleft') === true)

    mode = 'top right'
    await wrapper.setProps({ mode })
    assert(node.mode === mode)
    assert(img.classList.contains('taro-img__mode-topright') === true)

    mode = 'bottom left'
    await wrapper.setProps({ mode })
    assert(node.mode === mode)
    assert(img.classList.contains('taro-img__mode-bottomleft') === true)

    mode = 'bottom right'
    await wrapper.setProps({ mode })
    assert(node.mode === mode)
    assert(img.classList.contains('taro-img__mode-bottomright') === true)
  })

  it('should preload images', async () => {
    // mock window.IntersectionObserver
    let observe
    function IntersectionObserver (cb) {
      observe = cb
    }
    IntersectionObserver.prototype.observe = () => {}
    IntersectionObserver.prototype.unobserve = () => {}
    sinon.stub(window, 'IntersectionObserver').value(IntersectionObserver)

    const vh = document.documentElement.clientHeight
    const rootMargin = 300
    const onLoad = sinon.spy()
    const app = (
      <div>
        <div style={{ height: `${vh + rootMargin + 1}px` }}></div>
        <Image
          src={IMAGE}
          lazyLoad
          onLoad={onLoad}
        />
      </div>
    )

    const wrapper = await mount(app, scratch)
    const img = wrapper.find('img')

    await delay(50)

    assert(img.src === '')
    assert(onLoad.callCount === 0)

    // 触发相交
    observe([{ isIntersecting: true }])

    await delay(2000)
    assert(img.src === IMAGE)
    assert(onLoad.callCount === 1)
  })

  it('events', async () => {
    const onLoad = sinon.spy()
    const onError = sinon.spy()
    const app = (
      <Image
        src=''
        onLoad={onLoad}
        onError={ev => {
          // 停止冒泡，防止 Jasmine 监听到 onError 事件导致用例直接失败
          ev.stopPropagation()
          onError()
        }}
      />
    )
    const wrapper = await mount(app, scratch)

    await delay(50)
    assert(onLoad.callCount === 0)
    assert(onError.callCount === 1)

    wrapper.setProps({ src: IMAGE })

    await delay(2000)
    assert(onLoad.callCount === 1)
    const { width, height } = onLoad.firstCall.args[0].detail
    const image = wrapper.find('img')
    assert(width === image.width)
    assert(height === image.height)
    assert(onError.callCount === 1)
  })
})
