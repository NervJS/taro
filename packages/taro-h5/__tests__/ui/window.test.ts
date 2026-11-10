import { getWindowInfo } from '../../src/api/base/system'
import { offWindowResize, onWindowResize } from '../../src/api/ui/window'

test('reports the updated viewport dimensions to resize listeners', () => {
  const callback = jest.fn()
  const root = document.documentElement
  const width = jest.spyOn(root, 'clientWidth', 'get').mockReturnValue(800)
  const height = jest.spyOn(root, 'clientHeight', 'get').mockReturnValue(600)
  jest.spyOn(window.screen, 'width', 'get').mockReturnValue(1920)
  jest.spyOn(window.screen, 'height', 'get').mockReturnValue(1080)
  onWindowResize(callback)

  try {
    window.dispatchEvent(new Event('resize'))
    width.mockReturnValue(600)
    height.mockReturnValue(400)
    window.dispatchEvent(new Event('resize'))

    expect(callback.mock.calls).toEqual([
      [{ windowWidth: 800, windowHeight: 600 }],
      [{ windowWidth: 600, windowHeight: 400 }]
    ])
    expect(getWindowInfo()).toMatchObject(callback.mock.lastCall[0])

    offWindowResize(callback)
    window.dispatchEvent(new Event('resize'))
    expect(callback).toHaveBeenCalledTimes(2)
  } finally {
    offWindowResize(callback)
    jest.restoreAllMocks()
  }
})
