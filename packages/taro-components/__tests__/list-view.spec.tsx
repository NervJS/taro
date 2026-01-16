import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { ListView } from '../src/components/list-view/list-view'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('ListView', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [ListView],
      template: () => (<taro-list-view-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-list-view-core></taro-list-view-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
