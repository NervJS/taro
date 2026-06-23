import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { NestedScrollBody } from '../src/components/nested-scroll-body/nested-scroll-body'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('NestedScrollBody', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [NestedScrollBody],
      template: () => (<taro-nested-scroll-body-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-nested-scroll-body-core></taro-nested-scroll-body-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
