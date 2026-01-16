import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Editor } from '../src/components/editor/editor'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('Editor', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [Editor],
      template: () => (<taro-editor-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-editor-core></taro-editor-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
