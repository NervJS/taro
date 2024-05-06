import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { DraggableSheet } from '../src/components/draggable-sheet/draggable-sheet'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('DraggableSheet', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [DraggableSheet],
      template: () => (<taro-draggable-sheet-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-draggable-sheet-core></taro-draggable-sheet-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
