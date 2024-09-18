import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { ArCamera } from '../src/components/ar-camera/ar-camera'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('ArCamera', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [ArCamera],
      template: () => (<taro-ar-camera-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-ar-camera-core></taro-ar-camera-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
