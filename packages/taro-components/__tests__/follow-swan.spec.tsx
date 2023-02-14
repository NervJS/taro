import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { FollowSwan } from '../src/components/follow-swan/follow-swan'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('FollowSwan', () => {
  let page: SpecPage

  it('unimplemented', async () => {
    page = await newSpecPage({
      components: [FollowSwan],
      template: () => (<taro-follow-swan-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-follow-swan-core></taro-follow-swan-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
