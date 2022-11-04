import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { KeyboardAccessory } from './keyboard-accessory'
import { printUnimplementedWarning } from '../../../__tests__/utils'

const logError = jest.fn()
console.error = logError

describe('KeyboardAccessory', () => {
  it('unimplemented', async () => {
    const page = await newSpecPage({
      components: [KeyboardAccessory],
      template: () => (<taro-keyboard-accessory-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-keyboard-accessory-core></taro-keyboard-accessory-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
