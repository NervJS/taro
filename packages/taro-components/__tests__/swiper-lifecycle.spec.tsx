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

  it.each([true, false])('applies the latest detached currentItemId once with circular=%s', async (circular) => {
    const component = await mount()
    page.root!.circular = circular
    await page.waitForChanges()
    component.swiper.realIndex = 1
    page.root!.remove()
    await page.waitForChanges()
    const slideTo = jest.spyOn(SwiperJS.prototype, circular ? 'slideToLoop' : 'slideTo')

    page.root!.currentItemId = 'second'
    await page.waitForChanges()
    page.root!.currentItemId = 'third'
    await page.waitForChanges()

    expect(component.swiper).toBeNull()
    expect(slideTo).not.toHaveBeenCalled()
    page.doc.body.appendChild(page.root!)
    await page.waitForChanges()

    expect(component.swiper.initialized).toBe(true)
    expect(slideTo).toHaveBeenCalledTimes(1)
    expect(slideTo).toHaveBeenCalledWith(2)
    expect(slideTo.mock.instances[0]).toBe(component.swiper)

    // 目标项只应用一次，后续重连仍保留用户后来滑到的位置
    component.swiper.realIndex = 1
    slideTo.mockClear()
    page.root!.remove()
    await page.waitForChanges()
    page.doc.body.appendChild(page.root!)
    await page.waitForChanges()

    expect(component.swiper.realIndex).toBe(1)
    expect(slideTo).not.toHaveBeenCalled()
  })

  it('keeps an empty currentItemId as the latest detached update', async () => {
    const component = await mount()
    component.swiper.realIndex = 1
    page.root!.remove()
    await page.waitForChanges()
    const slideToLoop = jest.spyOn(SwiperJS.prototype, 'slideToLoop')

    page.root!.currentItemId = 'third'
    await page.waitForChanges()
    page.root!.currentItemId = ''
    await page.waitForChanges()
    page.doc.body.appendChild(page.root!)
    await page.waitForChanges()

    expect(slideToLoop).toHaveBeenCalledTimes(1)
    expect(slideToLoop).toHaveBeenCalledWith(0)
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

  it('applies current during invalid-instance recovery and later saves the active slide', async () => {
    const component = await mount()
    const instance = component.swiper
    instance.realIndex = 1
    instance.wrapperEl = undefined as unknown as HTMLElement
    instance.slidesEl = undefined as unknown as HTMLElement

    page.root!.current = 2
    await page.waitForChanges()

    expect(component.swiper).not.toBe(instance)
    expect(instance.destroyed).toBe(true)
    expect(component.swiper.realIndex).toBe(2)

    // 待应用索引生效后，普通卸载仍应保存用户后来滑到的位置
    component.swiper.realIndex = 1
    page.root!.remove()
    await page.waitForChanges()
    page.doc.body.appendChild(page.root!)
    await page.waitForChanges()

    expect(component.swiper.realIndex).toBe(1)
  })

  it('ignores events from the replaced instance', async () => {
    const component = await mount()
    const previous = component.swiper
    const touchEnd = previous.params.on!.touchEnd!
    page.root!.circular = false
    await page.waitForChanges()
    const start = jest.spyOn(previous.autoplay, 'start')

    // 销毁前排队的回调不能重新启动旧实例
    touchEnd.call(previous, previous, {} as PointerEvent)

    expect(component.swiper).not.toBe(previous)
    expect(start).not.toHaveBeenCalled()
    expect(previous.destroyed).toBe(true)
  })

  it('does not emit slide changes while restoring loop order for a child update', async () => {
    const component = await mount()
    const instance = component.swiper
    const change = jest.spyOn(component.onChange, 'emit')
    jest.spyOn(instance, 'loopDestroy').mockImplementation(() => {
      instance.realIndex = 1
      instance.params.on!.slideChange!.call(instance, instance)
    })

    page.root!.appendChild(page.doc.createElement('taro-swiper-item-core'))

    expect(change).not.toHaveBeenCalled()
    page.root!.remove()
    await page.waitForChanges()
  })
})
