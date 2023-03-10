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

describe('CoverView e2e', () => {
  let page: E2EPage

  it('default props', async () => {
    page = await newE2EPage({
      html: `<taro-cover-view-core></taro-cover-view-core>`,
    })
    const el = await page.find('taro-cover-view-core')

    expect(await el?.getProperty('hoverClass')).toBeUndefined()
    expect(await el?.getProperty('hoverStartTime')).toEqual(50)
    expect(await el?.getProperty('hoverStayTime')).toEqual(400)
  })

  it('should update props successfully', async () => {
    let hoverClass = 'hover'
    let hoverStartTime = 100
    let hoverStayTime = 300
    page = await newE2EPage({
      html: `<taro-cover-view-core
        hover-class="${hoverClass}"
        hover-start-time="${hoverStartTime}"
        hover-stay-time="${hoverStayTime}"
      >
      </taro-cover-view-core>`,
    })
    let el = await page.find('taro-cover-view-core')
    expect(await el?.getProperty('hoverClass')).toEqual(hoverClass)
    expect(await el?.getProperty('hoverStartTime')).toEqual(hoverStartTime)
    expect(await el?.getProperty('hoverStayTime')).toEqual(hoverStayTime)

    hoverClass = 'active'
    hoverStartTime = 200
    hoverStayTime = 600

    el.setProperty('hoverClass', hoverClass)
    el.setProperty('hoverStartTime', hoverStartTime)
    el.setProperty('hoverStayTime', hoverStayTime)
    await page.waitForChanges()

    el = await page.find('taro-cover-view-core')
    expect(await el?.getProperty('hoverClass')).toEqual(hoverClass)
    expect(await el?.getProperty('hoverStartTime')).toEqual(hoverStartTime)
    expect(await el?.getProperty('hoverStayTime')).toEqual(hoverStayTime)
  })
})
