import { saveFileToDisk } from '@tarojs/taro-h5'

describe('saveFileToDisk', () => {
  afterEach(() => jest.restoreAllMocks())

  it.each(['/reports/monthly.csv', 'blob:http://localhost/recording'])('requests a browser download for %s', async filePath => {
    const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const success = jest.fn()
    const complete = jest.fn()
    const result = await saveFileToDisk({ filePath, success, complete })
    const link = click.mock.instances[0] as HTMLAnchorElement

    expect(link.href).toBe(new URL(filePath, document.baseURI).href)
    expect(link.hasAttribute('download')).toBe(true)
    expect(result.errMsg).toBe('saveFileToDisk:ok')
    expect(success).toHaveBeenCalledWith(result)
    expect(complete).toHaveBeenCalledWith(result)
  })

  it.each(['', 'javascript:void(0)', 'https://example.com/report.csv'])('fails without opening %s', async filePath => {
    const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    await expect(saveFileToDisk({ filePath })).rejects.toMatchObject({
      errMsg: expect.stringContaining('saveFileToDisk:fail'),
    })
    expect(click).not.toHaveBeenCalled()
  })
})
