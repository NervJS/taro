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
