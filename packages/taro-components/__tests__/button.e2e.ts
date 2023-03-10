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

import { E2EPage, newE2EPage } from '@stencil/core/testing'

import { delay } from './utils'

describe('Button e2e', () => {
  let page: E2EPage

  it('event', async () => {
    const hoverStartTime = 50
    const hoverStayTime = 100
    page = await newE2EPage({
      html: `<taro-button-core
        size="fork"
        hover-start-time="${hoverStartTime}"
        hover-stay-time="${hoverStayTime}"
      >button</taro-button-core>`,
    })
    const el = await page.find('taro-button-core')
    const onClick = await el.spyOnEvent('click')
    const onTouchStart = await el.spyOnEvent('touchstart')
    const onTouchEnd = await el.spyOnEvent('touchend')

    expect(el.getAttribute('hover-start-time')).toEqual(hoverStartTime.toString())
    expect(el.getAttribute('hover-stay-time')).toEqual(hoverStayTime.toString())
    // expect(el.classList.contains('button-hover')).toEqual(false)

    el.click()
    await page.waitForChanges()
    expect(onClick).toHaveReceivedEventTimes(1)

    el.triggerEvent('touchstart')
    await page.waitForChanges()
    expect(onTouchStart).toHaveReceivedEventTimes(1)

    await delay(hoverStartTime + 10)
    expect(el.classList.contains('button-hover')).toEqual(true)

    el.triggerEvent('touchend')
    await page.waitForChanges()
    expect(onTouchEnd).toHaveReceivedEventTimes(1)

    await delay(hoverStayTime + 10)
    expect(el.classList.contains('button-hover')).toEqual(false)
  })
})
