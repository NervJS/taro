import { Current } from '@tarojs/runtime'
import { createVideoContext } from '@tarojs/taro-h5'

describe('createVideoContext ID lookup', () => {
  const previous = Current.page
  afterEach(() => {
    Current.page = previous
    document.body.replaceChildren()
  })

  it.each(['clip', 'clip:1', 'clip"one', 'clip[1]', 'clip one'])('finds a literal ID %s in the current page', id => {
    const page = document.createElement('div')
    page.id = '/video-test'
    const otherPage = document.createElement('div')
    const other = document.createElement('taro-video-core')
    other.id = id
    otherPage.appendChild(other)
    const video = document.createElement('taro-video-core')
    video.id = id
    page.appendChild(video)
    document.body.append(otherPage, page)
    Current.page = { path: page.id }
    expect(createVideoContext(id)).toBe(video)
    expect(createVideoContext('missing')).toBeUndefined()
  })
})
