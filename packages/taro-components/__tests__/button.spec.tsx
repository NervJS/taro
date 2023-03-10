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
import { AnyHTMLElement } from '@stencil/core/internal'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Button } from '../src/components/button/button'
import { delay } from './utils'

describe('Button', () => {
  let page: SpecPage
  it('props', async () => {
    const size = 'mini'
    const plain = true
    const loading = true
    const disabled = false
    page = await newSpecPage({
      components: [Button],
      template: () => (<taro-button-core
        size={size}
        plain={plain}
        loading={loading}
        disabled={disabled}
      >button</taro-button-core>),
    })

    expect(page.root?.type).not.toBeUndefined()
    expect(page.root?.plain).toEqual(true)
    expect(page.root?.loading).toEqual(true)
    expect(page.root?.size).toEqual('mini')
    expect(page.root?.disabled).toEqual(false)

    await delay(3000)
    const icon = page.root?.querySelector<AnyHTMLElement>('i')
    expect(icon?.classList.contains('weui-loading')).toEqual(true)
    expect(page.root?.textContent).toEqual('button')

    page.root?.setAttribute('plain', 'false')
    await page.waitForChanges()
    expect(page.root?.plain).toEqual(false)

    page.root?.setAttribute('loading', 'false')
    await page.waitForChanges()
    expect(page.root?.loading).toEqual(false)
    expect(icon?.parentNode).toBeNull()

    page.root?.setAttribute('disabled', 'true')
    await page.waitForChanges()
    expect(page.root?.disabled).toEqual(true)

    page.root?.setAttribute('size', 'big')
    await page.waitForChanges()
    expect(page.root?.size).toEqual('big')

    expect(page.root).toMatchSnapshot()
  })
})
