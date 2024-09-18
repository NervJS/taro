import { E2EPage, newE2EPage } from '@stencil/core/testing'

describe('Audio', () => {
  let page: E2EPage

  it('props', async () => {
    const src = 'http://storage.jd.com/cjj-pub-images/horse.ogv'
    const controls = true
    const loop = true
    page = await newE2EPage({
      html: `<taro-audio-core src="${src}" controls="${controls}" loop="${loop}"></taro-audio-core>`,
    })

    const el = await page.find('taro-audio-core')
    const audio = await el.find('audio')
    // expect(audio).toBeInstanceOf(HTMLAudioElement)
    expect(el.getAttribute('src')).toEqual(src)
    expect(audio).toHaveAttribute('controls')
    expect(audio).toHaveAttribute('loop')

    el.toggleAttribute('controls', false)
    el.toggleAttribute('loop', false)
    await page.waitForChanges()
    expect(audio).not.toHaveAttribute('controls')
    expect(audio).not.toHaveAttribute('loop')
  })
})
