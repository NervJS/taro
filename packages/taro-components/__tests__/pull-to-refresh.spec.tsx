import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { PullToRefresh } from '../src/components/pull-to-refresh/pull-to-refresh'

describe('PullToRefresh', () => {
  let page: SpecPage

  it('base', async () => {
    page = await newSpecPage({
      components: [PullToRefresh],
      template: () => (<taro-pull-to-refresh-core />),
    })
    expect(page.root).toMatchSnapshot()
  })
})
