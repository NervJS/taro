import * as Taro from '@tarojs/taro-h5'

/** 让挂起的微任务/宏任务都执行完 */
const flush = () => new Promise(resolve => setTimeout(resolve, 0))

const BROKEN_URL = 'https://example.com/broken.png'

/** 打开预览，并返回容器内渲染出来的 img 节点 */
function imagesInPreview () {
  return Array.from(document.querySelectorAll<HTMLImageElement>('.preview-image img'))
}

describe('previewImage', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('图片加载成功时回调 previewImage:ok 并挂载预览容器', async () => {
    const success = jest.fn()
    const complete = jest.fn()

    await Taro.previewImage({
      urls: [BROKEN_URL],
      current: BROKEN_URL,
      success,
      complete,
    })

    expect(document.querySelector('.preview-image')).not.toBeNull()
    expect(imagesInPreview()).toHaveLength(1)
    expect(success).toHaveBeenCalledWith(expect.objectContaining({ errMsg: 'previewImage:ok' }))
    expect(complete).toHaveBeenCalledWith(expect.objectContaining({ errMsg: 'previewImage:ok' }))
  })

  it('图片加载失败时 errMsg 应带 previewImage:fail 前缀并指明失败的图片', async () => {
    const fail = jest.fn()

    await Taro.previewImage({
      urls: [BROKEN_URL],
      current: BROKEN_URL,
      fail,
    })
    await flush()

    const [image] = imagesInPreview()
    expect(image).toBeTruthy()

    // 浏览器在 <img> 加载失败时派发的是普通 Event，不存在 message 字段
    image.dispatchEvent(new Event('error'))
    await flush()

    expect(fail).toHaveBeenCalledTimes(1)
    const res = fail.mock.calls[0][0]
    expect(typeof res.errMsg).toBe('string')
    expect(res.errMsg).toContain('previewImage:fail')
    expect(res.errMsg).toContain(BROKEN_URL)
  })

  it('同一张图片重复派发 error 时只回调一次 fail', async () => {
    const fail = jest.fn()

    await Taro.previewImage({
      urls: [BROKEN_URL],
      current: BROKEN_URL,
      fail,
    })
    await flush()

    const [image] = imagesInPreview()
    image.dispatchEvent(new Event('error'))
    image.dispatchEvent(new Event('error'))
    await flush()

    expect(fail).toHaveBeenCalledTimes(1)
  })

  it('多张图片分别加载失败时各自上报自己的 url', async () => {
    const fail = jest.fn()
    const first = 'https://example.com/first.png'
    const second = 'https://example.com/second.png'

    await Taro.previewImage({
      urls: [first, second],
      current: first,
      fail,
    })
    await flush()

    const images = imagesInPreview()
    expect(images).toHaveLength(2)

    images[1].dispatchEvent(new Event('error'))
    await flush()

    expect(fail).toHaveBeenCalledTimes(1)
    expect(fail.mock.calls[0][0].errMsg).toContain(second)
  })
})
