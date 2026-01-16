import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { CustomWrapper } from '../src/components/custom-wrapper/custom-wrapper'

describe('CustomWrapper', () => {
  let page: SpecPage

  it('有一个空的占位元素，并且 slot 能够使用', async () => {
    page = await newSpecPage({
      components: [CustomWrapper],
      template: () => (<taro-custom-wrapper-core>
        <div />
        <div />
      </taro-custom-wrapper-core>),
    })
    await page.waitForChanges()

    expect(page.root?.childNodes.length).toBe(2)
  })
})
