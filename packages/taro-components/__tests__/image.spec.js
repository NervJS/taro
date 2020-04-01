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

  const IMAGE = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAFA3PEY8MlBGQUZaVVBfeMiCeG5uePWvuZHI////////////////////////////////////////////////////2wBDAVVaWnhpeOuCguv/////////////////////////////////////////////////////////////////////////wAARCAEsAZADASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAECAwQF/8QALhABAQACAgICAQMDAgcBAAAAAAECEQMhEjFBUWEEEyIyQnEjoRQzUmKBkbHB/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oADAMBAAIRAxEAPwDcyMCIyAqirqKgyyY5tsmOYIACgE9kc9g2wb4scG2KDSGUMUJqk0EZMc22THMRJAKAAgMAAAQAHCOSgDIwBkAMgAAAAAAAAAAAAAAAAAAAB3GQAFTJAqiqqKDPJjk2yY5AgjJQHPZHPYN8G2LHBtig0hlFzHYJKtZJEck+QY5Mcm2THIEABQgAAAF9gBIvHC5Oni4Jj3l7Blx8G52rLGepHRl60nHH5Bx5Y2E35cZtl4gkz8S0AAAEAAAAAAAAAAAAAAAAAAdwI0UFQVEKoq6igzyY5NsmOQIACgE9g57Btg3xYYOnDPjwm7lLQaY467qtsZz4W621w7mwOlZuAIOfOaY5Orlx3NubIEEej0oktK1bVTjv0CJN1vjw2ji4759zp1YwEcfFMY00ZUCvdF6hyCwGFlyyvRzibag0DC4zXpllO3XcZUZccoOSwm2fFWeWFgJIwBAAAAAAAAAxYAh6EjXHHoGWiaWI12DrBBFMqCoFU06mgjJlk1yZZCII1TH5y6UTJb6i5JPfsbvqdHIuA7vyetejJRXHh55yR29SanqM+Dj8Md33WjNAAECs3NOfPDV3p0lQcnhL6P8Abt1p0ftzy2uYgwx4tWba3HU6XoKJxx72sjADQMARgCAAAjAJsZ54StSs2DjynaNOrPCac+U7BIAAgYACQKnYDXR6XJ0cgJxxaSHjirWoDHOdiYqs3T0iqBAAVBUBU06mgnJnZtpU+liFJJPyV7vZyb9n0oUh/wCS2Vqh7bfp+Pyy8svUZ8XHeTOT4+Xb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'

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
