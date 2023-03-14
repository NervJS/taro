import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { GridView } from '../src/components/grid-view/grid-view'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('GridView', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [GridView],
      template: () => (<taro-grid-view-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-grid-view-core></taro-grid-view-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
