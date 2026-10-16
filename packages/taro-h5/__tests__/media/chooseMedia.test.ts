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
function chooseFiles (names: string[]) {
  const result = Taro.chooseMedia({ mediaType: ['image'], count: names.length })
  const input = document.getElementById('taroChooseMedia') as HTMLInputElement
  const files = names.map(name => new File(['x'], name, { type: 'image/png' }))
  Object.defineProperty(input, 'files', { value: files, configurable: true })
  input.dispatchEvent(new Event('change'))
  return result
}

const pathsOf = (res: Taro.chooseMedia.SuccessCallbackResult) => res.tempFiles.map(file => file.tempFilePath)

describe('chooseMedia', () => {
  const OriginalImage = window.Image
  const originalCreateObjectURL = URL.createObjectURL

  beforeEach(() => {
    FakeImage.created = []
    window.Image = FakeImage as unknown as typeof Image
    URL.createObjectURL = jest.fn((file: File) => `blob:${file.name}`)
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    jest.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('')
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    window.Image = OriginalImage
    URL.createObjectURL = originalCreateObjectURL
    jest.restoreAllMocks()
  })

  test('tempFiles should keep FileList order when files finish loading in reverse', async () => {
    const result = chooseFiles(['A', 'B', 'C', 'D'])
    for (const index of [3, 2, 1, 0]) {
      finishLoading(index)
      await flush()
    }
    expect(pathsOf(await result)).toEqual(['blob:A', 'blob:B', 'blob:C', 'blob:D'])
  })

  test('should drop a file that fails to load and keep the others in order', async () => {
    const result = chooseFiles(['A', 'B', 'C'])
    finishLoading(2)
    await flush()
    failLoading(1)
    await flush()
    finishLoading(0)
    expect(pathsOf(await result)).toEqual(['blob:A', 'blob:C'])
  })
})
