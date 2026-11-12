import { downloadFile } from '../../src/api/network/download'
import { uploadFile } from '../../src/api/network/upload'

const header = { 'Invalid Header': 'value' }

describe.each([
  ['downloadFile', (callbacks) => downloadFile({ url: '/file', header, ...callbacks })],
  ['uploadFile', (callbacks) => uploadFile({ url: '/file', filePath: 'blob:file', name: 'file', header, ...callbacks })],
] as const)('%s setup failure', (name, start) => {
  test.each([false, true])('returns a rejected task and reports the original error (callbacks: %s)', async withCallbacks => {
    const fail = jest.fn()
    const complete = jest.fn()
    const success = jest.fn()
    const xhr = new XMLHttpRequest()
    const setRequestHeader = jest.spyOn(xhr, 'setRequestHeader').mockImplementation(() => {
      throw new DOMException('Invalid header name', 'SyntaxError')
    })
    const send = jest.spyOn(xhr, 'send')
    const create = jest.spyOn(window, 'XMLHttpRequest').mockReturnValue(xhr)

    try {
      const task = start(withCallbacks ? { success, fail, complete } : {})
      const result = expect(task).rejects.toEqual({
        errMsg: `${name}:fail Invalid header name`
      })
      expect(typeof task.onHeadersReceived).toBe('function')
      expect(typeof task.onProgressUpdate).toBe('function')
      task.abort()
      await result
      expect(setRequestHeader).toHaveBeenCalledWith('Invalid Header', 'value')
      expect(send).not.toHaveBeenCalled()
      expect(success).not.toHaveBeenCalled()
      expect(fail).toHaveBeenCalledTimes(withCallbacks ? 1 : 0)
      expect(complete).toHaveBeenCalledTimes(withCallbacks ? 1 : 0)
    } finally {
      create.mockRestore()
      send.mockRestore()
      setRequestHeader.mockRestore()
    }
  })
})
