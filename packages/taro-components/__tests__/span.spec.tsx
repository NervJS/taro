import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Span } from '../src/components/span/span'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('Span', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [Span],
      template: () => <taro-span-core />,
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-span-core></taro-span-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
