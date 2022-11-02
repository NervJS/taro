import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { Text } from './text'

describe('Text', () => {
  it('slot', async () => {
    const text = 'Taro Next'
    const page = await newSpecPage({
      components: [Text],
      template: () => (<taro-text-core>{text}</taro-text-core>),
    })
    expect(page.root?.textContent).toEqual(text)
  })
})
