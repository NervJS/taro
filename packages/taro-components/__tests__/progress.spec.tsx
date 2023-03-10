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

import { Progress } from '../src/components/progress/progress'

describe('Progress', () => {
  let page: SpecPage

  it('props', async () => {
    page = await newSpecPage({
      components: [Progress],
      template: () => (<taro-progress-core />),
    })

    let bar = page.root?.querySelector<AnyHTMLElement>('.weui-progress__bar')
    let innerBar = page.root?.querySelector<AnyHTMLElement>('.weui-progress__inner-bar')
    let opr = page.root?.querySelector<AnyHTMLElement>('.weui-progress__opr')

    expect(bar?.style.height).toEqual('6px')
    expect(bar?.style.backgroundColor).toEqual('#EBEBEB')
    expect(innerBar?.style.width).toEqual('0%')
    // expect(innerBar?.style.transition).toEqual('none 0s ease 0s')
    expect(innerBar?.style.backgroundColor).toEqual('#09BB07')
    expect(innerBar?.style.borderRadius).toEqual('0px')
    expect(opr).toBeNull()

    const percent = 66
    const borderRadius = 10
    const fontSize = 24
    const strokeWidth = 10
    const activeColor = 'yellow'
    const backgroundColor = 'blue'

    page.root?.setAttribute('percent', percent.toString())
    page.root?.setAttribute('border-radius', borderRadius.toString())
    page.root?.setAttribute('font-size', fontSize.toString())
    page.root?.setAttribute('stroke-width', strokeWidth.toString())
    page.root?.setAttribute('active-color', activeColor)
    page.root?.setAttribute('background-color', backgroundColor)
    page.root?.setAttribute('active', 'true')
    page.root?.setAttribute('show-info', 'true')
    await page.waitForChanges()

    bar = page.root?.querySelector<AnyHTMLElement>('.weui-progress__bar')
    innerBar = page.root?.querySelector<AnyHTMLElement>('.weui-progress__inner-bar')
    opr = page.root?.querySelector<AnyHTMLElement>('.weui-progress__opr')

    expect(bar?.style.height).toEqual(`${strokeWidth}px`)
    expect(bar?.style.backgroundColor).toEqual(backgroundColor)
    expect(innerBar?.style.width).toEqual(`${percent}%`)
    // expect(innerBar?.style.transition).toEqual('width 1s ease-in-out 0s')
    expect(innerBar?.style.backgroundColor).toEqual(activeColor)
    expect(innerBar?.style.borderRadius).toEqual(`${borderRadius}px`)
    expect(opr?.style.fontSize).toEqual(`${fontSize}px`)
    expect(opr?.innerHTML).toEqual(`<span>${percent}%</span>`)
  })

  it('should percent between 0~100', async () => {
    page = await newSpecPage({
      components: [Progress],
      template: () => (<taro-progress-core percent={-18} showInfo />),
    })

    let innerBar = page.root?.querySelector<AnyHTMLElement>('.weui-progress__inner-bar')
    let opr = page.root?.querySelector<AnyHTMLElement>('.weui-progress__opr')

    expect(innerBar?.style.width).toEqual('0%')
    expect(opr?.innerHTML).toEqual(`<span>0%</span>`)

    page.root?.setAttribute('percent', '150')
    await page.waitForChanges()

    innerBar = page.root?.querySelector<AnyHTMLElement>('.weui-progress__inner-bar')
    opr = page.root?.querySelector<AnyHTMLElement>('.weui-progress__opr')

    expect(innerBar?.style.width).toEqual(`100%`)
    expect(opr?.innerHTML).toEqual(`<span>100%</span>`)
  })
})
