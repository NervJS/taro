import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { Slot } from './slot'
import { printUnimplementedWarning } from '../../../__tests__/utils'

const logError = jest.fn()
console.error = logError

describe('Slot', () => {
  it('unimplemented', async () => {
    const page = await newSpecPage({
      components: [Slot],
      template: () => (<taro-slot-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-slot-core></taro-slot-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
