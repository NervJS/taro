import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { Editor } from './editor'
import { printUnimplementedWarning } from '../../../__tests__/utils'

const logError = jest.fn()
console.error = logError

describe('Editor', () => {
  it('unimplemented', async () => {
    const page = await newSpecPage({
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
