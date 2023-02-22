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

import { Icon } from '../src/components/icon/icon'

describe('Icon', () => {
  let page: SpecPage

  it('props', async () => {
    page = await newSpecPage({
      components: [Icon],
      template: () => (<taro-icon-core />),
    })
    await page.waitForChanges()

    expect(page.root?.style.fontSize).toBe('23px')

    const type = 'success'
    const size = '40'
    const color = 'rgb(255, 0, 0)'

    page.root?.setAttribute('type', type)
    page.root?.setAttribute('size', size)
    page.root?.setAttribute('color', color)
    await page.waitForChanges()

    expect(page.root?.classList.contains(`weui-icon-${type}`)).toBe(true)
    expect(page.root?.style.fontSize).toBe(`${size}px`)
    expect(page.root?.style.color).toBe(color)
  })
})
