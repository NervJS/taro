import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Lottie } from '../src/components/lottie/lottie'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('Lottie', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [Lottie],
      template: () => (<taro-lottie-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-lottie-core></taro-lottie-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
