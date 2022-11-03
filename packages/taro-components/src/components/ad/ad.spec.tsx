import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { Ad } from './ad'
import { printUnimplementedWarning } from '../../../__tests__/utils'

const logError = jest.fn()
console.error = logError

describe('Ad', () => {
  it('unimplemented', async () => {
    const page = await newSpecPage({
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
