/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

import { CoverView } from '../src/components/cover-view/cover-view'
import { delay } from './utils'

describe('CoverView', () => {
  let page: SpecPage

  it('slot', async () => {
    const text = 'i m div'
    page = await newSpecPage({
      components: [CoverView],
      template: () => (<taro-cover-view-core>
        <div />
        <div />
        {text}
      </taro-cover-view-core>),
    })

    expect(page.root?.textContent).toEqual(text)
  })

  it('should hover perform correctly', async () => {
    const hoverClass = 'hover'
    const hoverStartTime = 50
    const hoverStayTime = 400

    page = await newSpecPage({
      components: [CoverView],
      template: () => (<taro-cover-view-core
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
      components: [CoverView],
      template: () => (<taro-cover-view-core onlongpress={onLongPress} />),
    })
    await page.waitForChanges()

    page.root?.dispatchEvent(new Event('touchstart'))
    await delay(400)

    expect(onLongPress).toHaveBeenCalledTimes(1)
  })
})
