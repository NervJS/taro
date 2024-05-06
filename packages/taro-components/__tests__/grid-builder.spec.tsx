import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { GridBuilder } from '../src/components/grid-builder/grid-builder'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('GridBuilder', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [GridBuilder],
      template: () => (<taro-grid-builder-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-grid-builder-core></taro-grid-builder-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
