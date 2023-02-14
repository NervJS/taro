import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { KeyboardAccessory } from '../src/components/keyboard-accessory/keyboard-accessory'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('KeyboardAccessory', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
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
