import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { ListBuilder } from '../src/components/list-builder/list-builder'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('ListBuilder', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [ListBuilder],
      template: () => (<taro-list-builder-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-list-builder-core></taro-list-builder-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
