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

describe('Checkbox', () => {
  let page: E2EPage

  it('checkbox', async () => {
    const value = 'taro'
    const red = 'rgb(255, 0, 0)'
    page = await newE2EPage({
      html: `<taro-checkbox-core value="${value}" color="${red}"></taro-checkbox-core>`,
    })
    await page.waitForChanges()
    const el = await page.find('taro-checkbox-core')
    const input = await el.find('input')

    const style = await input.getComputedStyle()
    expect(style.color).toBe(red)
    expect(el.getAttribute('value')).toBe(value)
    expect(await el.getProperty('checked')).toBe(false)
    expect(await input.getProperty('checked')).toBe(false)

    await input.click()
    await page.waitForChanges()
    expect(await input.getProperty('checked')).toBe(true)
  })

  it('checkbox-group', async () => {
    const list = [
      { value: 'America' },
      { value: 'China', checked: 'true' },
      { value: 'Brazil' },
      { value: 'Japan' },
      { value: 'Britain' },
      { value: 'French' }
    ]
    page = await newE2EPage({
      html: `<taro-checkbox-group-core name="checkbox">
        ${list.map(item => `<taro-checkbox-core
          key="${item.value}"
          value="${item.value}"
          ${item.checked ? 'checked' : ''}
        />`).join('')}
      </taro-checkbox-group-core>`,
    })
    
    await page.waitForChanges()
    const el = await page.find('taro-checkbox-group-core')
    const inputList = await page.findAll('input')
    const onChange = await el.spyOnEvent('change')

    let value = await el.getProperty('value')
    expect(value).toHaveLength(1)
    expect(value.includes('China')).toBe(true)
    expect(await page.findAll('taro-checkbox-core[name=checkbox]')).toHaveLength(list.length)

    await inputList[inputList.length - 1].click()
    await page.waitForChanges()

    value = await el.getProperty('value')
    expect(value).toHaveLength(2)
    expect(value.includes('China')).toBe(true)
    expect(value.includes('French')).toBe(true)
    expect(onChange).toHaveReceivedEventTimes(1)
    expect(onChange.firstEvent.detail.value).toEqual(value)
  })
})
