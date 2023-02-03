import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { InlinePaymentPanel } from '../src/components/inline-payment-panel/inline-payment-panel'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('InlinePaymentPanel', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [InlinePaymentPanel],
      template: () => (<taro-inline-payment-panel-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-inline-payment-panel-core></taro-inline-payment-panel-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
