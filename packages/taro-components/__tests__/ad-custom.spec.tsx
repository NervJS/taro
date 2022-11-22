import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { AdCustom } from '../src/components/ad-custom/ad-custom'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('AdCustom', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [AdCustom],
      template: () => (<taro-ad-custom-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-ad-custom-core></taro-ad-custom-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
