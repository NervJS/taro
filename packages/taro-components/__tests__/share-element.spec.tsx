import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { ShareElement } from '../src/components/share-element/share-element'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('ShareElement', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [ShareElement],
      template: () => (<taro-share-element-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-share-element-core></taro-share-element-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
