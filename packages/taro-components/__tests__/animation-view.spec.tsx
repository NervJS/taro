import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { AnimationView } from '../src/components/animation-view/animation-view'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('AnimationView', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [AnimationView],
      template: () => (<taro-animation-view-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-animation-view-core></taro-animation-view-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
