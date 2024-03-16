import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { NativeSlot } from '../src/components/slot/native-slot'
import { Slot } from '../src/components/slot/slot'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('Slot', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [Slot],
      template: () => (<taro-slot-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-slot-core></taro-slot-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })

  it('unimplemented native-slot', async () => {
    page = await newSpecPage({
      components: [NativeSlot],
      template: () => (<taro-native-slot-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-native-slot-core></taro-native-slot-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
