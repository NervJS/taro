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

import { E2EPage, newE2EPage } from '@stencil/core/testing'

describe('Slider e2e', () => {
  let page: E2EPage

  it('props', async () => {
    page = await newE2EPage({
      html: `<taro-slider-core></taro-slider-core>`,
    })
    const el = await page.find('taro-slider-core')
    const inner = await page.find('.weui-slider__inner')
    const track = await page.find('.weui-slider__track')
    const handler = await page.find('.weui-slider__handler')
    let box = await page.find('.weui-slider-box__value')
    await page.waitForChanges()

    let innerStyle = await inner.getComputedStyle()
    let trackStyle = await track.getComputedStyle()
    let handlerStyle = await handler.getComputedStyle()
    expect(innerStyle.backgroundColor).toEqual('rgb(233, 233, 233)')
    expect(trackStyle.width).toEqual('0px')
    expect(trackStyle.backgroundColor).toEqual('rgb(26, 173, 25)')
    expect(handlerStyle.left).toEqual('0px')
    expect(handlerStyle.width).toEqual('28px')
    expect(handlerStyle.height).toEqual('28px')
    expect(handlerStyle.backgroundColor).toEqual('rgb(255, 255, 255)')
    expect(box).toBeNull()
    expect(await el.getProperty('disabled')).toEqual(false)

    const value = 50
    const activeColor = 'rgb(97, 144, 232)'
    const backgroundColor = 'rgb(255, 0, 0)'
    const blockColor = 'rgb(51, 51, 51)'
    const blockSize = 20

    el.setProperty('value', value.toString())
    el.setProperty('activeColor', activeColor)
    el.setProperty('backgroundColor', backgroundColor)
    el.setProperty('blockColor', blockColor)
    el.setProperty('blockSize', blockSize.toString())
    el.setProperty('showValue', 'true')
    el.setProperty('disabled', 'true')
    await page.waitForChanges()

    box = await page.find('.weui-slider-box__value')

    innerStyle = await inner.getComputedStyle()
    trackStyle = await track.getComputedStyle()
    handlerStyle = await handler.getComputedStyle()
    expect(innerStyle.backgroundColor).toEqual(backgroundColor)
    // expect(trackStyle.width).toEqual(`${value}%`)
    expect(trackStyle.backgroundColor).toEqual(activeColor)
    // expect(handlerStyle.left).toEqual('0%')
    expect(handlerStyle.width).toEqual('20px')
    expect(handlerStyle.height).toEqual('20px')
    expect(handlerStyle.backgroundColor).toEqual(blockColor)
    expect(box.textContent).toEqual(value.toString())
    expect(await el.getProperty('disabled')).toEqual(true)
  })
})
