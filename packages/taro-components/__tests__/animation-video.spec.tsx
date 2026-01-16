import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { AnimationVideo } from '../src/components/animation-video/animation-video'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('AnimationVideo', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [AnimationVideo],
      template: () => (<taro-animation-video-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-animation-video-core></taro-animation-video-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
