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

import { Nodes, RichText } from '../src/components/rich-text/rich-text'

describe('RichText', () => {
  const SNAPSHOT = '<div class="div_class" style="line-height: 60px; color: red; margin-top: 10px; padding: 50px 30px;">Hello&nbsp;World!</div>'
  let page: SpecPage

  it('should render array nodes', async () => {
    const nodes: Nodes = [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height:    60px;    color:red;margin-top: 10px; padding: 50px 30px'
      },
      children: [{
        type: 'text',
        text: 'Hello&nbsp;World!'
      }]
    }]
    page = await newSpecPage({
      components: [RichText],
      template: () => (<taro-rich-text-core nodes={nodes} />),
    })

    expect(page.root?.innerHTML).toEqual(SNAPSHOT)
  })

  it('should render array nodes', async () => {
    const nodes = SNAPSHOT
    page = await newSpecPage({
      components: [RichText],
      template: () => (<taro-rich-text-core nodes={nodes} />),
    })

    expect(page.root?.innerHTML).toEqual(SNAPSHOT)
  })
})
