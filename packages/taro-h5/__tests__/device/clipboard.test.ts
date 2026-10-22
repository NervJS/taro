import { getClipboardData, setClipboardData } from '../../src/api/device/clipboard'
import { setStorageSync } from '../../src/api/storage'
import { showToast } from '../../src/api/ui/interaction'

jest.mock('../../src/api/ui/interaction', () => ({ showToast: jest.fn() }))

describe('setClipboardData', () => {
  let execCommand: jest.Mock
  const originalExecCommand = Object.getOwnPropertyDescriptor(document, 'execCommand')

  beforeEach(() => {
    execCommand = jest.fn(() => true)
    Object.defineProperty(document, 'execCommand', { configurable: true, value: execCommand })
    setStorageSync('taro_clipboard', 'previous content')
    jest.mocked(showToast).mockClear()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    localStorage.clear()
    jest.restoreAllMocks()
    if (originalExecCommand) Object.defineProperty(document, 'execCommand', originalExecCommand)
    else delete document.execCommand
  })

  function failCopy (mode: string) {
    if (mode === 'returns false') execCommand.mockReturnValue(false)
    else execCommand.mockImplementation(() => { throw new Error('copy denied') })
  }

  test.each(['succeeds', 'returns false', 'throws'])('cleans up without textarea.remove when copying %s', async mode => {
    jest.spyOn(HTMLTextAreaElement.prototype, 'select').mockImplementation(function () {
      Object.defineProperty(this, 'remove', { value: undefined })
    })
    if (mode !== 'succeeds') failCopy(mode)
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    const result = await setClipboardData({ data: 'new content', success, fail, complete })

    expect(result).toEqual({
      errMsg: mode === 'succeeds'
        ? 'setClipboardData:ok'
        : `setClipboardData:fail ${mode === 'returns false' ? 'Failed to copy to clipboard' : 'copy denied'}`
    })
    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(document.querySelector('textarea')).toBeNull()
    expect(success).toHaveBeenCalledTimes(mode === 'succeeds' ? 1 : 0)
    expect(fail).toHaveBeenCalledTimes(mode === 'succeeds' ? 0 : 1)
    expect(complete).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledWith(result)
    expect(showToast).toHaveBeenCalledTimes(mode === 'succeeds' ? 1 : 0)
    expect((await getClipboardData()).data).toBe(mode === 'succeeds' ? 'new content' : 'previous content')
  })

  describe.each(['QuotaExceededError', 'SecurityError'])('when caching throws %s after a successful copy', errorName => {
    beforeEach(() => {
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('Clipboard cache write failed', errorName)
      })
    })

    test('rejects and cleans up while leaving the readable cache unchanged', async () => {
      await expect(setClipboardData({ data: 'new content' })).rejects.toEqual({
        errMsg: 'setClipboardData:fail Clipboard cache write failed'
      })

      expect(execCommand).toHaveBeenCalledTimes(1)
      expect(execCommand).toHaveBeenCalledWith('copy')
      expect(document.querySelector('textarea')).toBeNull()
      expect(showToast).not.toHaveBeenCalled()
      expect((await getClipboardData()).data).toBe('previous content')
    })

    test('calls fail and complete once without reporting success', async () => {
      const success = jest.fn()
      const fail = jest.fn()
      const complete = jest.fn()

      const result = await setClipboardData({ data: 'new content', success, fail, complete })

      expect(result).toEqual({ errMsg: 'setClipboardData:fail Clipboard cache write failed' })
      expect(execCommand).toHaveBeenCalledTimes(1)
      expect(execCommand).toHaveBeenCalledWith('copy')
      expect(success).not.toHaveBeenCalled()
      expect(fail).toHaveBeenCalledTimes(1)
      expect(fail).toHaveBeenCalledWith(result)
      expect(complete).toHaveBeenCalledTimes(1)
      expect(complete).toHaveBeenCalledWith(result)
      expect(document.querySelector('textarea')).toBeNull()
      expect(showToast).not.toHaveBeenCalled()
      expect((await getClipboardData()).data).toBe('previous content')
    })
  })

  test.each(['returns false', 'throws'])('rejects when copying %s and removes the temporary textarea', async mode => {
    failCopy(mode)

    await expect(setClipboardData({ data: 'new content' })).rejects.toEqual({
      errMsg: `setClipboardData:fail ${mode === 'returns false' ? 'Failed to copy to clipboard' : 'copy denied'}`
    })

    expect(document.querySelector('textarea')).toBeNull()
    expect(showToast).not.toHaveBeenCalled()
    expect((await getClipboardData()).data).toBe('previous content')
  })

  test.each(['returns false', 'throws'])('calls fail and complete once when copying %s', async mode => {
    failCopy(mode)
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()

    const result = await setClipboardData({ data: 'new content', success, fail, complete })

    expect(result.errMsg).toMatch(/^setClipboardData:fail /)
    expect(success).not.toHaveBeenCalled()
    expect(fail).toHaveBeenCalledTimes(1)
    expect(fail).toHaveBeenCalledWith(result)
    expect(complete).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledWith(result)
    expect(document.querySelector('textarea')).toBeNull()
    expect(showToast).not.toHaveBeenCalled()
  })

  test('cleans up when selecting the text throws', async () => {
    jest.spyOn(HTMLTextAreaElement.prototype, 'select').mockImplementation(() => { throw new Error('selection failed') })

    await expect(setClipboardData({ data: 'new content' })).rejects.toEqual({ errMsg: 'setClipboardData:fail selection failed' })

    expect(document.querySelector('textarea')).toBeNull()
    expect(execCommand).not.toHaveBeenCalled()
    expect(showToast).not.toHaveBeenCalled()
  })

  test('rejects when execCommand is unavailable without changing the cached value', async () => {
    Object.defineProperty(document, 'execCommand', { configurable: true, value: undefined })

    await expect(setClipboardData({ data: 'new content' })).rejects.toEqual({
      errMsg: 'setClipboardData:fail Unsupported Function: \'document.execCommand\'.'
    })

    expect((await getClipboardData()).data).toBe('previous content')
    expect(document.querySelector('textarea')).toBeNull()
    expect(showToast).not.toHaveBeenCalled()
  })

  test.each([false, true])('preserves successful copying with hideDefaultMessage=%s', async hideDefaultMessage => {
    const data = 'line one\nline two'
    const success = jest.fn()
    const fail = jest.fn()
    const complete = jest.fn()
    execCommand.mockImplementation(() => {
      expect(document.querySelector('textarea')?.value).toBe(data)
      return true
    })

    const result = await setClipboardData({ data, options: { hideDefaultMessage }, success, fail, complete })

    expect(result).toEqual({ errMsg: 'setClipboardData:ok' })
    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(document.querySelector('textarea')).toBeNull()
    expect((await getClipboardData()).data).toBe(data)
    expect(success).toHaveBeenCalledTimes(1)
    expect(success).toHaveBeenCalledWith(result)
    expect(fail).not.toHaveBeenCalled()
    expect(complete).toHaveBeenCalledTimes(1)
    expect(showToast).toHaveBeenCalledTimes(hideDefaultMessage ? 0 : 1)
  })
})
