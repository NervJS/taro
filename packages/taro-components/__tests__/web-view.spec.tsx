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

import { WebView } from '../src/components/web-view/web-view'

const TARO_WEBSITE = 'https://taro.jd.com/home/in.html'

describe('WebView', () => {
  let page: SpecPage

  it('should show an iframe', async () => {
    page = await newSpecPage({
      components: [WebView],
      template: () => (<taro-web-view-core src={TARO_WEBSITE} />),
    })
    await page.waitForChanges()
    expect(page.root?.src).toEqual(TARO_WEBSITE)
  })

  it('events', async () => {
    const onLoad = jest.fn()
    page = await newSpecPage({
      components: [WebView],
      template: () => (<taro-web-view-core src={TARO_WEBSITE} onLoad={onLoad} />),
    })
    await page.waitForChanges()
    page.root?.dispatchEvent(new Event('load'))
    expect(onLoad).toBeCalledTimes(1)
  })
})
