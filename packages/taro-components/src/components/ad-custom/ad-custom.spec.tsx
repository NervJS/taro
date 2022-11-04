import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { AdCustom } from './ad-custom'
import { printUnimplementedWarning } from '../../../__tests__/utils'

const logError = jest.fn()
console.error = logError

describe('AdCustom', () => {
  it('unimplemented', async () => {
    const page = await newSpecPage({
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
