import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Snapshot } from '../src/components/snapshot/snapshot'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('Snapshot', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [Snapshot],
      template: () => <taro-snapshot-core />,
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-snapshot-core></taro-snapshot-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
