/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { View } from '../src/components/view/view'
import { delay } from './utils'

describe('View', () => {
  let page: SpecPage

  it('default props', async () => {
    page = await newSpecPage({
      components: [View],
      template: () => (<taro-view-core />),
    })

    expect(page.root?.hoverClass).toEqual(undefined)
    expect(page.root?.hoverStartTime).toEqual(50)
    expect(page.root?.hoverStayTime).toEqual(400)
  })

  it('slot', async () => {
    const text = 'i m div'
    page = await newSpecPage({
      components: [View],
      template: () => (<taro-view-core>
        <div />
        <div />
        {text}
      </taro-view-core>),
    })

    expect(page.root?.textContent).toEqual(text)
  })

  it('should update props successfully', async () => {
    let hoverClass = 'hover'
    let hoverStartTime = 100
    let hoverStayTime = 300
    page = await newSpecPage({
      components: [View],
      template: () => (<taro-view-core
        hoverClass={hoverClass}
        hoverStartTime={hoverStartTime}
        hoverStayTime={hoverStayTime}
      />),
    })

    expect(page.root?.hoverClass).toEqual(hoverClass)
    expect(page.root?.hoverStartTime).toEqual(hoverStartTime)
    expect(page.root?.hoverStayTime).toEqual(hoverStayTime)

    hoverClass = 'active'
    hoverStartTime = 200
    hoverStayTime = 600

    page.root?.setAttribute('hover-class', hoverClass)
    page.root?.setAttribute('hover-start-time', hoverStartTime.toString())
    page.root?.setAttribute('hover-stay-time', hoverStayTime.toString())

    await page.waitForChanges()
    expect(page.root?.hoverClass).toEqual(hoverClass)
    expect(page.root?.hoverStartTime).toEqual(hoverStartTime)
    expect(page.root?.hoverStayTime).toEqual(hoverStayTime)
  })

  it('should hover perform correctly', async () => {
    const hoverClass = 'hover'
    const hoverStartTime = 50
    const hoverStayTime = 400
    page = await newSpecPage({
      components: [View],
      template: () => (<taro-view-core
        hoverClass={hoverClass}
      />),
    })
    page.root?.dispatchEvent(new Event('touchstart'))
    await delay(hoverStartTime + 30)
    await page.waitForChanges()
    expect(page.root?.classList.contains(hoverClass)).toEqual(true)

    page.root?.dispatchEvent(new Event('touchend'))
    await delay(hoverStayTime - 30)
    await page.waitForChanges()
    expect(page.root?.classList.contains(hoverClass)).toEqual(true)
    await delay(100)
    await page.waitForChanges()
    expect(page.root?.classList.contains(hoverClass)).toEqual(false)
  })

  it('should trigger longpress', async () => {
    const onLongPress = jest.fn()
    page = await newSpecPage({
      components: [View],
      template: () => (<taro-view-core onlongpress={onLongPress} />),
    })

    page.root?.dispatchEvent(new Event('touchstart'))
    await delay(400)

    expect(onLongPress).toBeCalledTimes(1)
  })

  it('should support animation-iteration-count as number', async () => {
    page = await newSpecPage({
      components: [View],
      template: () => (<taro-view-core style={{ animationIterationCount: '1' }} />),
    })
    await page.waitForChanges()
    expect(page.root?.style.animationIterationCount).toBe('1')
  })

  it('should not add "px" suffix for custom properties', async () => {
    page = await newSpecPage({
      components: [View],
      template: () => (<taro-view-core style={{ '--taro': '100px' }} />),
    })

    expect(page.root?.style.cssText).toBe('--taro: 100px;')
    expect(page.root?.style.getPropertyValue('--taro')).toBe('100px')
  })

  it('should not add "px" suffix for custom properties for numeric', async () => {
    page = await newSpecPage({
      components: [View],
      template: () => (<taro-view-core style={{ '--taro': '100' }} />),
    })

    expect(page.root?.style.cssText).toBe('--taro: 100;')
    expect(page.root?.style.getPropertyValue('--taro')).toBe('100')
  })
})
