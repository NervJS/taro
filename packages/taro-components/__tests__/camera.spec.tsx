import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Camera } from '../src/components/camera/camera'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('Camera', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [Camera],
      template: () => (<taro-camera-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-camera-core></taro-camera-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
