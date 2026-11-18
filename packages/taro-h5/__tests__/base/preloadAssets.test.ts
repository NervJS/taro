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
})
