import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { CommentDetail } from '../src/components/comment/comment-detail'
import { CommentList } from '../src/components/comment/comment-list'
import { printUnimplementedWarning } from './utils'

const logError = jest.fn()
console.error = logError

describe('Comment', () => {
  let page: SpecPage

  it('unimplemented comment-list', async () => {
    page = await newSpecPage({
      components: [CommentList],
      template: () => (<taro-comment-list-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-comment-list-core></taro-comment-list-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })

  it('unimplemented comment-detail', async () => {
    page = await newSpecPage({
      components: [CommentDetail],
      template: () => (<taro-comment-detail-core />),
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <taro-comment-detail-core></taro-comment-detail-core>
    `)
    expect(logError).toHaveBeenCalledWith(printUnimplementedWarning(page.root))
  })
})
