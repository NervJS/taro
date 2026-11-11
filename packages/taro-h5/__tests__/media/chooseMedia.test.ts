import * as Taro from '@tarojs/taro-h5'

// 用假的 Image 控制每个文件完成加载的先后
class FakeImage {
  static created: FakeImage[] = []
  crossOrigin = ''
  complete = false
  width = 0
  height = 0
  src = ''
  onload: (() => void) | null = null
  onerror: ((e: unknown) => void) | null = null

  constructor () {
    FakeImage.created.push(this)
  }
}

// 让挂起的回调都执行完，确保一个文件加载完成后再处理下一个
const flush = () => new Promise(resolve => setTimeout(resolve, 0))

function finishLoading (index: number) {
  const image = FakeImage.created[index]
  image.width = 1080
  image.height = 1920
  image.onload?.()
}

function failLoading (index: number) {
  FakeImage.created[index].onerror?.(new Error('decode failed'))
}

/** 调用 chooseMedia，并让隐藏的 input 以 names 作为 FileList 触发 change */
function chooseFiles (names: string[], type = 'image/png') {
  const result = Taro.chooseMedia({ mediaType: ['image'], count: names.length })
  const input = document.getElementById('taroChooseMedia') as HTMLInputElement
  const files = names.map(name => new File(['x'], name, { type }))
  Object.defineProperty(input, 'files', { value: files, configurable: true })
  input.dispatchEvent(new Event('change'))
  return result
}

const pathsOf = (res: Taro.chooseMedia.SuccessCallbackResult) => res.tempFiles.map(file => file.tempFilePath)

describe('chooseMedia', () => {
  const OriginalImage = window.Image
  const originalCreateObjectURL = URL.createObjectURL
  const originalRevokeObjectURL = URL.revokeObjectURL

  beforeEach(() => {
    FakeImage.created = []
    window.Image = FakeImage as unknown as typeof Image
    URL.createObjectURL = jest.fn((file: File) => `blob:${file.name}`)
    URL.revokeObjectURL = jest.fn()
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    jest.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('')
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    window.Image = OriginalImage
    URL.createObjectURL = originalCreateObjectURL
    URL.revokeObjectURL = originalRevokeObjectURL
    jest.restoreAllMocks()
  })

  test('tempFiles should keep FileList order when files finish loading in reverse', async () => {
    const result = chooseFiles(['A', 'B', 'C', 'D'])
    for (const index of [3, 2, 1, 0]) {
      finishLoading(index)
      await flush()
    }
    expect(pathsOf(await result)).toEqual(['blob:A', 'blob:B', 'blob:C', 'blob:D'])
    expect(URL.revokeObjectURL).not.toHaveBeenCalled()
  })

  test('should drop a file that fails to load and keep the others in order', async () => {
    const result = chooseFiles(['A', 'B', 'C'])
    finishLoading(2)
    await flush()
    failLoading(1)
    await flush()
    finishLoading(0)
    expect(pathsOf(await result)).toEqual(['blob:A', 'blob:C'])
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:B')
  })

  test('releases each failed image once across repeated selections', async () => {
    for (const name of ['first', 'second']) {
      const result = chooseFiles([name])
      const index = FakeImage.created.length - 1
      failLoading(index)
      failLoading(index)
      expect(pathsOf(await result)).toEqual([])
    }
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2)
    expect(URL.revokeObjectURL).toHaveBeenNthCalledWith(1, 'blob:first')
    expect(URL.revokeObjectURL).toHaveBeenNthCalledWith(2, 'blob:second')
  })

  test('does not release a returned image on a late error', async () => {
    const result = chooseFiles(['A'])
    finishLoading(0)
    expect(pathsOf(await result)).toEqual(['blob:A'])
    failLoading(0)
    await flush()
    expect(URL.revokeObjectURL).not.toHaveBeenCalled()
  })

  test('releases the object URL when video decoding fails', async () => {
    const createElement = document.createElement.bind(document)
    let video: HTMLVideoElement
    jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const element = createElement(tag)
      if (tag === 'video') video = element as HTMLVideoElement
      return element
    })
    jest.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(() => {})
    const result = chooseFiles(['broken.mp4'], 'video/mp4')
    video!.dispatchEvent(new Event('error'))
    expect(pathsOf(await result)).toEqual([])
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:broken.mp4')
  })

  test('releases the object URL when reading a video file fails', async () => {
    jest.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(function () {
      this.dispatchEvent(new Event('error'))
    })
    const result = chooseFiles(['unreadable.mp4'], 'video/mp4')
    expect(pathsOf(await result)).toEqual([])
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:unreadable.mp4')
  })
})
