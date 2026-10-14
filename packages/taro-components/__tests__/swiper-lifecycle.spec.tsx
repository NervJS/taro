import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import SwiperJS from '../__mocks__/swiper/bundle'
import { Swiper } from '../src/components/swiper/swiper'

type SwiperComponent = Omit<Swiper, never> & { swiper: SwiperJS }

describe('Swiper lifecycle', () => {
  let page: SpecPage

  const mount = async () => {
    page = await newSpecPage({
      components: [Swiper],
      template: () => (
        <taro-swiper-core circular autoplay interval={400}>
          <taro-swiper-item-core class='swiper-slide' item-id='first' />
          <taro-swiper-item-core class='swiper-slide' item-id='second' />
          <taro-swiper-item-core class='swiper-slide' item-id='third' />
        </taro-swiper-core>
      ),
    })
    return page.rootInstance as SwiperComponent
  }

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  it('stops autoplay and destroys the instance when disconnected', async () => {
    const component = await mount()
    const instance = component.swiper
    expect(instance.initialized).toBe(true)
    expect(instance.autoplay.running).toBe(true)

    page.root!.remove()
    await page.waitForChanges()

    expect(instance.autoplay.running).toBe(false)
    expect(instance.destroyed).toBe(true)
    expect(component.swiper).toBeNull()
  })

  it('defers detached prop changes and restores them on reconnect', async () => {
    const component = await mount()
    const previous = component.swiper
    const loopDestroy = jest.spyOn(previous, 'loopDestroy')
    page.root!.remove()
    await page.waitForChanges()
    expect(loopDestroy).toHaveBeenCalledTimes(1)
    loopDestroy.mockClear()

    page.root!.circular = false
    page.root!.current = 2
    page.root!.autoplay = false
    await page.waitForChanges()
    page.root!.circular = true
    page.root!.autoplay = true
    await page.waitForChanges()

    expect(loopDestroy).not.toHaveBeenCalled()
    expect(component.swiper).toBeNull()
    page.doc.body.appendChild(page.root!)
    await page.waitForChanges()

    expect(component.swiper).not.toBe(previous)
    expect(component.swiper.initialized).toBe(true)
    expect(component.swiper.realIndex).toBe(2)
    expect(component.swiper.autoplay.running).toBe(true)
  })

  it('allows child updates while detached after changing circular', async () => {
    const component = await mount()
    page.root!.remove()
    await page.waitForChanges()
    page.root!.circular = false
    await page.waitForChanges()
    page.root!.circular = true
    await page.waitForChanges()
    const child = page.doc.createElement('taro-swiper-item-core')
    child.className = 'swiper-slide'

    expect(() => page.root!.appendChild(child)).not.toThrow()
    page.doc.body.appendChild(page.root!)
    await page.waitForChanges()

    expect(component.swiper.initialized).toBe(true)
    expect(component.swiper.wrapperEl.contains(child)).toBe(true)
    expect(component.swiper.autoplay.running).toBe(true)
  })

  it('cancels pending wrapper work before disconnecting', async () => {
    const component = await mount()
    page.root!.circular = false
    await page.waitForChanges()
    const instance = component.swiper
    const update = jest.spyOn(instance, 'update')
    const reset = jest.spyOn(component, 'reset')
    jest.useFakeTimers()
    component.handleSwiperSizeDebounce()

    page.root!.remove()
    jest.advanceTimersByTime(50)
    jest.useRealTimers()
    await page.waitForChanges()

    expect(update).not.toHaveBeenCalled()
    expect(reset).not.toHaveBeenCalled()
    expect(instance.destroyed).toBe(true)
  })

  it('skips loopDestroy and recovers when slidesEl becomes invalid', async () => {
    const component = await mount()
    const instance = component.swiper
    const loopDestroy = jest.spyOn(instance, 'loopDestroy')
    jest.useFakeTimers()
    // 仅让真实循环方法访问的节点失效，验证 wrapper 仍存在时也受到保护
    instance.slidesEl = undefined as unknown as HTMLElement
    const child = page.doc.createElement('taro-swiper-item-core')
    child.className = 'swiper-slide'

    expect(() => page.root!.appendChild(child)).not.toThrow()
    expect(loopDestroy).not.toHaveBeenCalled()
    jest.advanceTimersByTime(50)
    jest.useRealTimers()
    await page.waitForChanges()

    expect(component.swiper).not.toBe(instance)
    expect(component.swiper.initialized).toBe(true)
    expect(component.swiper.autoplay.running).toBe(true)
    expect(component.swiper.wrapperEl.contains(child)).toBe(true)
  })

  it('preserves pending current through invalid-instance recovery and later saves the active slide', async () => {
    const component = await mount()
    const instance = component.swiper
    instance.realIndex = 1
    instance.wrapperEl = undefined as unknown as HTMLElement
    instance.slidesEl = undefined as unknown as HTMLElement

    page.root!.current = 2
    await page.waitForChanges()

    expect(component.swiper).not.toBe(instance)
    expect(component.swiper.realIndex).toBe(2)

    // 待应用索引生效后，普通卸载仍应保存用户后来滑到的位置
    component.swiper.realIndex = 1
    page.root!.remove()
    await page.waitForChanges()
    page.doc.body.appendChild(page.root!)
    await page.waitForChanges()

    expect(component.swiper.realIndex).toBe(1)
  })
})
