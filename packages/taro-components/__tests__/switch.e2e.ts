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

describe('Switch e2e', () => {
  let page: E2EPage

  it('props', async () => {
    page = await newE2EPage({
      html: `<taro-switch-core checked></taro-switch-core>`,
    })
    const el = await page.find('taro-switch-core')
    const input = await el.find('input')
    let inputStyle = await input.getComputedStyle()

    expect(await el.getProperty('checked')).toEqual(true)
    expect(await el.getProperty('value')).toEqual(true)
    expect(input.classList.contains('weui-switch')).toEqual(true)
    expect(inputStyle.borderColor).toEqual('rgb(4, 190, 2)')
    expect(inputStyle.backgroundColor).toEqual('rgb(4, 190, 2)')

    const color = 'rgb(255, 0, 0)'
    el.setProperty('type', 'checkbox')
    el.setProperty('color', color)
    await page.waitForChanges()

    inputStyle = await input.getComputedStyle()
    expect(input.classList.contains('weui-checkbox')).toEqual(true)
    expect(inputStyle.backgroundColor).toEqual(color)
  })

  it('events', async () => {
    page = await newE2EPage({
      html: `<taro-switch-core></taro-switch-core>`,
    })
    const onChange = await page.spyOnEvent('change')
    const el = await page.find('taro-switch-core')
    const input = await el.find('input')

    expect(await input.getProperty('checked')).toEqual(false)
    expect(await el.getProperty('value')).toEqual(false)

    await input.click()
    await page.waitForChanges()

    expect(await input.getProperty('checked')).toEqual(true)
    expect(onChange).toHaveReceivedEventTimes(1)
    expect(onChange.firstEvent.detail.value).toEqual(true)
  })
})
