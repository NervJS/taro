import { preloadAssets } from '@tarojs/taro-h5'

describe('preloadAssets', () => {
  const links = () => Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="preload"]'))
  afterEach(() => links().forEach(link => link.remove()))

  it('preloads images and anonymous fonts and shares concurrent requests', async () => {
    const first = preloadAssets({ data: [{ type: 'image', src: '/hero.png' }, { type: 'font', src: '/font.woff2' }] })
    const second = preloadAssets({ data: [{ type: 'image', src: 'http://localhost/hero.png' }] })
    const [image, font] = links()
    expect(links()).toHaveLength(2)
    expect(image.as).toBe('image')
    expect(font.as).toBe('font')
    expect(font.crossOrigin).toBe('anonymous')

    image.dispatchEvent(new Event('load'))
    font.dispatchEvent(new Event('load'))
    await expect(first).resolves.toMatchObject({ errMsg: 'preloadAssets:ok' })
    await expect(second).resolves.toMatchObject({ errMsg: 'preloadAssets:ok' })
    expect(links()).toHaveLength(0)
  })

  it('cleans up consecutive batches and lets a completed URL be preloaded again', async () => {
    for (let batch = 0; batch < 4; batch++) {
      const data = Array.from({ length: 25 }, (_, index) => ({
        type: 'image' as const,
        src: `/batch-${batch}-${index}.png`,
      }))
      const request = preloadAssets({ data })
      expect(links()).toHaveLength(25)
      links().forEach(link => link.dispatchEvent(new Event('load')))
      await request
      expect(links()).toHaveLength(0)
    }

    const repeat = preloadAssets({ data: [{ type: 'image', src: '/batch-0-0.png' }] })
    expect(links()).toHaveLength(1)
    links()[0].dispatchEvent(new Event('load'))
    await expect(repeat).resolves.toMatchObject({ errMsg: 'preloadAssets:ok' })
    expect(links()).toHaveLength(0)
  })

  it('reports a failed asset and permits retry', async () => {
    const options = { data: [{ type: 'image' as const, src: '/retry.png' }] }
    const failed = preloadAssets(options)
    links()[0].dispatchEvent(new Event('error'))
    await expect(failed).rejects.toMatchObject({ errMsg: expect.stringContaining('retry.png') })
    expect(links()).toHaveLength(0)
    const retry = preloadAssets(options)
    links()[0].dispatchEvent(new Event('load'))
    await expect(retry).resolves.toMatchObject({ errMsg: 'preloadAssets:ok' })
  })

  it('rejects malformed entries without scheduling a preload', async () => {
    await expect(preloadAssets({ data: [{ type: 'image', src: '' }] })).rejects.toMatchObject({
      errMsg: expect.stringContaining('preloadAssets:fail'),
    })
    expect(links()).toHaveLength(0)
  })

  it('calls fail and complete once even when multiple assets fail', async () => {
    const fail = jest.fn()
    const complete = jest.fn()
    const success = jest.fn()
    const request = preloadAssets({
      data: [{ type: 'font', src: '/missing.woff2' }, { type: 'image', src: '/missing.png' }],
      fail,
      complete,
      success,
    })
    links().forEach(link => link.dispatchEvent(new Event('error')))
    const result = await request
    expect(fail).toHaveBeenCalledTimes(1)
    expect(fail).toHaveBeenCalledWith(result)
    expect(complete).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledWith(result)
    expect(success).not.toHaveBeenCalled()
    expect(links()).toHaveLength(0)
  })
})
