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

describe('Progress', () => {
  let page: E2EPage

  it('props', async () => {
    page = await newE2EPage({
      html: `<taro-progress-core></taro-progress-core>`,
    })

    const el = await page.find('taro-progress-core')
    let bar = await page.find('.weui-progress__bar')
    let innerBar = await page.find('.weui-progress__inner-bar')
    let opr = await page.find('.weui-progress__opr')

    let barStyle = await bar.getComputedStyle()
    expect(barStyle.height).toEqual('6px')
    expect(barStyle.backgroundColor).toEqual('rgb(235, 235, 235)')
    let innerBarStyle = await innerBar.getComputedStyle()
    // expect(innerBarStyle.width).toEqual('0%')
    expect(innerBarStyle.transition).toEqual('none 0s ease 0s')
    expect(innerBarStyle.backgroundColor).toEqual('rgb(9, 187, 7)')
    expect(innerBarStyle.borderRadius).toEqual('0px')
    expect(opr).toBeNull()

    const percent = 66
    const borderRadius = 10
    const fontSize = 24
    const strokeWidth = 10
    const activeColor = 'rgb(255, 255, 0)'
    const backgroundColor = 'rgb(0, 0, 255)'

    el.setProperty('percent', percent)
    el.setProperty('borderRadius', borderRadius)
    el.setProperty('fontSize', fontSize)
    el.setProperty('strokeWidth', strokeWidth)
    el.setProperty('activeColor', activeColor)
    el.setProperty('backgroundColor', backgroundColor)
    el.setProperty('active', true)
    el.setProperty('showInfo', true)
    await page.waitForChanges()

    bar = await page.find('.weui-progress__bar')
    innerBar = await page.find('.weui-progress__inner-bar')
    opr = await page.find('.weui-progress__opr')

    barStyle = await bar.getComputedStyle()
    expect(barStyle.height).toEqual(`${strokeWidth}px`)
    expect(barStyle.backgroundColor).toEqual(backgroundColor)
    innerBarStyle = await innerBar.getComputedStyle()
    // expect(innerBarStyle.width).toEqual(`${percent}%`)
    expect(innerBarStyle.transition).toEqual('width 1s ease-in-out 0s')
    expect(innerBarStyle.backgroundColor).toEqual(activeColor)
    expect(innerBarStyle.borderRadius).toEqual(`${borderRadius}px`)
    const oprStyle = await opr.getComputedStyle()
    expect(oprStyle.fontSize).toEqual(`${fontSize}px`)
    expect(opr.innerHTML).toEqual(`<span>${percent}%</span>`)
  })

  it('should percent between 0~100', async () => {
    page = await newE2EPage({
      html: `<taro-progress-core percent="-18" show-info></taro-progress-core>`,
    })

    const el = await page.find('taro-progress-core')
    // let innerBar = await page.find('.weui-progress__inner-bar')
    let opr = await page.find('.weui-progress__opr')

    // let innerBarStyle = await innerBar.getComputedStyle()
    // expect(innerBarStyle.width).toEqual('0%')
    expect(opr.innerHTML).toEqual(`<span>0%</span>`)

    el.setProperty('percent', 150)
    await page.waitForChanges()

    // innerBar = await page.find('.weui-progress__inner-bar')
    opr = await page.find('.weui-progress__opr')

    // innerBarStyle = await innerBar.getComputedStyle()
    // expect(innerBarStyle.width).toEqual(`100%`)
    expect(opr.innerHTML).toEqual(`<span>100%</span>`)
  })
})
