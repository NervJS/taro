import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { ContactButton } from '../src/components/contact-button/contact-button'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('ContactButton', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [ContactButton],
      template: () => (<taro-contact-button-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-contact-button-core></taro-contact-button-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
