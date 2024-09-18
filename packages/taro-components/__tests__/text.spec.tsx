import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Text } from '../src/components/text/text'

describe('Text', () => {
  let page: SpecPage

  it('slot', async () => {
    const text = 'Taro Next'
    page = await newSpecPage({
      components: [Text],
      template: () => (<taro-text-core>{text}</taro-text-core>),
    })
    expect(page.root?.textContent).toEqual(text)
  })
})
