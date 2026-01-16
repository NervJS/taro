import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Ad } from '../src/components/ad/ad'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('Ad', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [Ad],
      template: () => (<taro-ad-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-ad-core></taro-ad-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
