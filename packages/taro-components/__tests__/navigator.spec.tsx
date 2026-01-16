import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Navigator } from '../src/components/navigator/navigator'

describe('Navigator', () => {
  let page: SpecPage

  it('base', async () => {
    page = await newSpecPage({
      components: [Navigator],
      template: () => (<taro-navigator-core />),
    })
    expect(page.root).toMatchSnapshot()
  })
})
