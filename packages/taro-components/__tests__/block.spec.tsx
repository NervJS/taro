import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Block } from '../src/components/block/block'

describe('Block', () => {
  let page: SpecPage

  it('有一个空的占位元素，并且 slot 能够使用', async () => {
    page = await newSpecPage({
      components: [Block],
      template: () => (<taro-block-core>
        <div />
        <div />
      </taro-block-core>),
    })
    await page.waitForChanges()

    expect(page.root?.childNodes.length).toBe(2)
  })
})
