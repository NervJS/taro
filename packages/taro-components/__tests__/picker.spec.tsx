import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Picker } from '../src/components/picker/picker'

describe('Picker closing animation', () => {
  let page: SpecPage
  let picker: Picker

  beforeEach(async () => {
    page = await newSpecPage({
      components: [Picker],
      html: '<taro-picker-core />'
    })
    picker = page.rootInstance
    jest.useFakeTimers('legacy')
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  const overlay = () => document.body.querySelector<HTMLElement>('.weui-picker__overlay')!
  const open = async () => {
    page.root!.firstElementChild!.dispatchEvent(new Event('click'))
    await page.waitForChanges()
  }
  const cancel = async () => {
    overlay().querySelector('.weui-mask')!.dispatchEvent(new Event('click'))
    await page.waitForChanges()
  }

  it('keeps a reopened picker visible after the previous close deadline', async () => {
    const onCancel = jest.fn()
    page.root!.addEventListener('cancel', onCancel)
    await open()
    await cancel()
    jest.advanceTimersByTime(100)
    await open()
    expect(overlay().querySelector('.weui-animate-fade-out')).toBeNull()
    jest.advanceTimersByTime(350)
    await page.waitForChanges()
    expect(picker.hidden).toBe(false)
    expect(overlay().style.display).not.toBe('none')
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('hides the picker when a normal closing animation completes', async () => {
    await open()
    await cancel()
    jest.advanceTimersByTime(349)
    expect(picker.hidden).toBe(false)
    jest.advanceTimersByTime(1)
    await page.waitForChanges()
    expect(picker.hidden).toBe(true)
    expect(picker.fadeOut).toBe(false)
    expect(overlay().style.display).toBe('none')
  })

  it('uses the latest closing animation when closed repeatedly', async () => {
    await open()
    await cancel()
    jest.advanceTimersByTime(100)
    await cancel()
    jest.advanceTimersByTime(250)
    expect(picker.hidden).toBe(false)
    jest.advanceTimersByTime(100)
    await page.waitForChanges()
    expect(picker.hidden).toBe(true)
  })

  it('clears a pending close when disconnected', async () => {
    await open()
    await cancel()
    page.root!.remove()
    // newSpecPage does not automatically deliver native disconnection callbacks.
    picker.disconnectedCallback()
    expect(document.body.querySelector('.weui-picker__overlay')).toBeNull()
    jest.advanceTimersByTime(350)
    expect(picker.hidden).toBe(false)
  })

  it('does not reopen a disabled picker', async () => {
    await open()
    await cancel()
    page.root!.setAttribute('disabled', '')
    await page.waitForChanges()
    await open()
    jest.advanceTimersByTime(350)
    await page.waitForChanges()
    expect(picker.hidden).toBe(true)
  })
})
