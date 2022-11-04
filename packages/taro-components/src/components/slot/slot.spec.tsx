import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { Slot } from './slot'

describe('Block', () => {
  it('有一个空的占位元素，并且 slot 能够使用', async () => {
    const page = await newSpecPage({
      components: [Slot],
      template: () => (<taro-slot-core>
        <div />
        <div />
      </taro-slot-core>),
    })
    await page.waitForChanges()

    expect(page.root?.childNodes.length).toBe(2)
  })
})
