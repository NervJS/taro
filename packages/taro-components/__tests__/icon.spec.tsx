import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Icon } from '../src/components/icon/icon'

describe('Icon', () => {
  let page: SpecPage

  it('props', async () => {
    page = await newSpecPage({
      components: [Icon],
      template: () => (<taro-icon-core />),
    })
    await page.waitForChanges()

    expect(page.root?.style.fontSize).toBe('23px')

    const type = 'success'
    const size = '40'
    const color = 'rgb(255, 0, 0)'

    page.root?.setAttribute('type', type)
    page.root?.setAttribute('size', size)
    page.root?.setAttribute('color', color)
    await page.waitForChanges()

    expect(page.root?.classList.contains(`weui-icon-${type}`)).toBe(true)
    expect(page.root?.style.fontSize).toBe(`${size}px`)
    expect(page.root?.style.color).toBe(color)
  })
})
