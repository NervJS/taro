import { h } from '@stencil/core'
import { newSpecPage } from '@stencil/core/testing'

import { MovableView } from '../src/components/movable-area/movable-view'

async function setup (threshold = 40, animation = false) {
  const page = await newSpecPage({
    components: [MovableView],
    template: () => <taro-movable-view-core direction='horizontal' snapThresholdX={threshold} animation={animation} />,
  })
  page.root.getBoundingClientRect = () => ({ width: 360, height: 80 }) as DOMRect
  await page.rootInstance.setParent({ element: page.root, area: { width: 280, height: 80 } })
  const changes: Array<{ x: number, y: number, source: string }> = []
  page.root.addEventListener('change', (event: CustomEvent) => changes.push(event.detail))
  const finger = (x: number) => ({ screenX: x, screenY: 0 })
  const start = (x: number) => page.rootInstance.handleTouchStart({ touches: [finger(x)] } as unknown as TouchEvent)
  const move = (x: number) => page.rootInstance.handleTouchMove({ touches: [finger(x)], preventDefault: jest.fn() } as unknown as TouchEvent)
  const end = (x: number) => page.rootInstance.handleTouchEnd({ touches: [], changedTouches: [finger(x)] } as unknown as TouchEvent)
  return { page, changes, finger, start, move, end }
}

describe('H5 SnapMovableView movement', () => {
  it('keeps max at exactly the threshold and snaps to min above it', async () => {
    const view = await setup()
    view.start(0)
    view.move(-40)
    view.end(-40)
    expect(view.page.root.style.transform).toContain('translateX(0px)')
    view.start(0)
    view.move(-40.1)
    view.end(-40.1)
    expect(view.page.root.style.transform).toContain('translateX(-80px)')
    expect(view.changes[view.changes.length - 1]?.source).toBe('snap')
  })

  it('keeps ordinary MovableView dragging without a snap source', async () => {
    const page = await newSpecPage({
      components: [MovableView],
      template: () => <taro-movable-view-core direction='horizontal' animation={false} />,
    })
    page.root.getBoundingClientRect = () => ({ width: 40, height: 40 }) as DOMRect
    await page.rootInstance.setParent({ element: page.root, area: { width: 100, height: 40 } })
    const changes: Array<{ x: number, source?: string }> = []
    page.root.addEventListener('change', (event: CustomEvent) => changes.push(event.detail))
    const finger = (x: number) => ({ screenX: x, screenY: 0 })
    page.rootInstance.handleTouchStart({ touches: [finger(0)] } as unknown as TouchEvent)
    page.rootInstance.handleTouchMove({ touches: [finger(20)], preventDefault: jest.fn() } as unknown as TouchEvent)
    page.rootInstance.handleTouchEnd({ touches: [], changedTouches: [finger(20)] } as unknown as TouchEvent)
    expect(page.root.style.transform).toContain('translateX(20px)')
    expect(changes[changes.length - 1]?.source).toBeUndefined()
    page.rootInstance.watchX(10)
    expect(changes[changes.length - 1]?.source).toBeUndefined()
  })

  it('snaps independently on both permitted axes', async () => {
    const page = await newSpecPage({
      components: [MovableView],
      template: () => <taro-movable-view-core direction='all' snapThresholdX={40} snapThresholdY={20} animation={false} />,
    })
    page.root.getBoundingClientRect = () => ({ width: 360, height: 80 }) as DOMRect
    await page.rootInstance.setParent({ element: page.root, area: { width: 280, height: 120 } })
    const finger = (x: number, y: number) => ({ screenX: x, screenY: y })
    page.rootInstance.handleTouchStart({ touches: [finger(0, 0)] } as unknown as TouchEvent)
    page.rootInstance.handleTouchMove({ touches: [finger(-50, 30)], preventDefault: jest.fn() } as unknown as TouchEvent)
    page.rootInstance.handleTouchEnd({ touches: [], changedTouches: [finger(-50, 30)] } as unknown as TouchEvent)
    expect(page.root.style.transform).toContain('translateX(-80px) translateY(40px)')
  })

  it('does not snap after a multi-touch or cancelled gesture', async () => {
    const view = await setup()
    view.start(0)
    view.page.rootInstance.handleTouchStart({ touches: [view.finger(0), view.finger(50)] } as unknown as TouchEvent)
    view.page.rootInstance.handleTouchEnd({ touches: [view.finger(0)], changedTouches: [view.finger(50)] } as unknown as TouchEvent)
    expect(view.page.root.style.transform).toContain('translateX(0px)')
    view.start(0)
    view.move(-60)
    view.page.rootInstance.handleTouchCancel()
    view.end(-60)
    expect(view.changes.some(change => change.source === 'snap')).toBe(false)
  })

  it('disables snapping when the threshold becomes null or undefined', async () => {
    const view = await setup()
    expect(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(view.page.root), 'snapThresholdX')).toBeDefined()
    view.page.root.snapThresholdX = null
    await view.page.waitForChanges()
    view.start(0)
    view.move(-60)
    view.end(-60)
    expect(view.page.root.style.transform).toContain('translateX(-60px)')
    expect(view.changes.some(change => change.source === 'snap')).toBe(false)

    view.page.root.snapThresholdX = 40
    await view.page.waitForChanges()
    view.page.root.snapThresholdX = undefined
    await view.page.waitForChanges()
    view.start(0)
    view.move(-60)
    view.end(-60)
    expect(view.changes.some(change => change.source === 'snap')).toBe(false)
  })

  it('marks code positioning as an empty source', async () => {
    const view = await setup()
    view.page.rootInstance.watchX(-20)
    expect(view.changes[view.changes.length - 1]?.source).toBe('')
  })

  it('emits snap changes and consumes controlled echoes in order', async () => {
    const frames: FrameRequestCallback[] = []
    const raf = jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(callback => {
      frames.push(callback)
      return frames.length
    })
    const cancel = jest.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {})
    try {
      const view = await setup(40, true)
      view.start(0)
      view.move(-60)
      view.end(-60)
      frames.shift()?.(0)
      frames.shift()?.(100)
      const emitted = view.changes[view.changes.length - 1]
      expect(emitted?.source).toBe('snap')
      view.page.rootInstance.watchX(emitted?.x)
      frames.shift()?.(300)
      expect(view.page.root.style.transform).toContain('translateX(-80px)')
      view.page.rootInstance.watchX(view.changes[view.changes.length - 1]?.x)
      expect(view.page.root.style.transform).toContain('translateX(-80px)')
    } finally {
      raf.mockRestore()
      cancel.mockRestore()
    }
  })

  it('keeps snapping when React writes the current position again', async () => {
    const frames = new Map<number, FrameRequestCallback>()
    let nextFrame = 0
    const raf = jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(callback => {
      frames.set(++nextFrame, callback)
      return nextFrame
    })
    const cancel = jest.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(id => { frames.delete(id) })
    const advance = (time: number) => {
      const [id, callback] = frames.entries().next().value
      frames.delete(id)
      callback(time)
    }
    try {
      const view = await setup(40, true)
      view.start(0)
      view.move(-50)
      view.end(-50)
      advance(0)
      advance(100)
      const current = view.changes[view.changes.length - 1].x
      view.page.rootInstance.watchX(current)
      view.page.rootInstance.watchX(current)
      expect(frames.size).toBe(1)
      advance(300)
      expect(view.page.root.style.transform).toContain('translateX(-80px)')
    } finally {
      raf.mockRestore()
      cancel.mockRestore()
    }
  })

  it('accepts a repeated one-frame-late echo on both axes', async () => {
    const frames = new Map<number, FrameRequestCallback>()
    let nextFrame = 0
    const raf = jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(callback => {
      frames.set(++nextFrame, callback)
      return nextFrame
    })
    const cancel = jest.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(id => { frames.delete(id) })
    const advance = (time: number) => {
      const [id, callback] = frames.entries().next().value
      frames.delete(id)
      callback(time)
    }
    try {
      const page = await newSpecPage({
        components: [MovableView],
        template: () => <taro-movable-view-core direction='all' snapThresholdX={40} snapThresholdY={40} animation />,
      })
      page.root.getBoundingClientRect = () => ({ width: 360, height: 360 }) as DOMRect
      await page.rootInstance.setParent({ element: page.root, area: { width: 280, height: 280 } })
      const finger = (value: number) => ({ screenX: value, screenY: value })
      page.rootInstance.handleTouchStart({ touches: [finger(0)] } as unknown as TouchEvent)
      page.rootInstance.handleTouchMove({ touches: [finger(-50)], preventDefault: jest.fn() } as unknown as TouchEvent)
      page.rootInstance.handleTouchEnd({ touches: [], changedTouches: [finger(-50)] } as unknown as TouchEvent)
      advance(0)
      advance(100)
      page.rootInstance.watchX(-50)
      page.rootInstance.watchY(-50)
      page.rootInstance.watchX(-50)
      page.rootInstance.watchY(-50)
      expect(frames.size).toBe(1)
      advance(300)
      expect(page.root.style.transform).toContain('translateX(-80px) translateY(-80px)')
    } finally {
      raf.mockRestore()
      cancel.mockRestore()
    }
  })

  it('consumes a later repeated position before treating an older echo as a command', async () => {
    const view = await setup()
    view.start(0)
    view.move(-40)
    view.move(-60)
    view.move(-40)
    view.move(-60)
    view.page.rootInstance.watchX(-40)
    view.page.rootInstance.watchX(-40)
    view.page.rootInstance.watchX(-60)
    view.page.rootInstance.watchX(-40)
    expect(view.page.root.style.transform).toContain('translateX(-40px)')
    expect(view.changes[view.changes.length - 1]?.source).toBe('')
  })

  it('prioritizes a pending echo over the same numeric command during snapping', async () => {
    const frames = new Map<number, FrameRequestCallback>()
    let nextFrame = 0
    const raf = jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(callback => {
      frames.set(++nextFrame, callback)
      return nextFrame
    })
    const cancel = jest.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(id => { frames.delete(id) })
    const advance = (time: number) => {
      const [id, callback] = frames.entries().next().value
      frames.delete(id)
      callback(time)
    }
    try {
      const view = await setup(40, true)
      view.start(0)
      view.move(-40)
      view.move(-60)
      view.end(-60)
      advance(0)
      advance(100)
      view.page.rootInstance.watchX(-40)
      expect(frames.size).toBe(1)
      advance(300)
      expect(view.page.root.style.transform).toContain('translateX(-80px)')
    } finally {
      raf.mockRestore()
      cancel.mockRestore()
    }
  })

  it('lets an external command inside a snap callback win over the current frame', async () => {
    const frames = new Map<number, FrameRequestCallback>()
    let nextFrame = 0
    const raf = jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(callback => {
      frames.set(++nextFrame, callback)
      return nextFrame
    })
    const cancel = jest.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(id => { frames.delete(id) })
    const advance = (time: number) => {
      const [id, callback] = frames.entries().next().value
      frames.delete(id)
      callback(time)
    }
    try {
      const view = await setup(40, true)
      view.page.root.addEventListener('change', (event: CustomEvent) => {
        if (event.detail.source === 'snap') view.page.rootInstance.watchX(0)
      })
      view.start(0)
      view.move(-60)
      view.end(-60)
      advance(0)
      advance(100)
      expect(frames.size).toBe(0)
      expect(view.page.root.style.transform).toContain('translateX(0px)')
      expect(view.changes[view.changes.length - 1]?.source).toBe('')
    } finally {
      raf.mockRestore()
      cancel.mockRestore()
    }
  })

  it('keeps an active snap when style changes without changing its bounds', async () => {
    const OriginalObserver = globalThis.MutationObserver
    let onMutation: MutationCallback | undefined
    globalThis.MutationObserver = class {
      constructor (callback: MutationCallback) { onMutation = callback }
      observe () {}
      disconnect () {}
    } as unknown as typeof MutationObserver
    const frames = new Map<number, FrameRequestCallback>()
    let nextFrame = 0
    const raf = jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(callback => {
      frames.set(++nextFrame, callback)
      return nextFrame
    })
    const cancel = jest.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(id => { frames.delete(id) })
    try {
      const view = await setup(40, true)
      view.start(0)
      view.move(-60)
      view.end(-60)
      expect(frames.size).toBe(1)
      const previousStyle = view.page.root.getAttribute('style')
      view.page.root.setAttribute('style', 'height: 80px; width: 360px;')
      onMutation?.([{ attributeName: 'style', oldValue: previousStyle, target: view.page.root } as MutationRecord], {} as MutationObserver)
      expect(frames.size).toBe(1)
    } finally {
      globalThis.MutationObserver = OriginalObserver
      raf.mockRestore()
      cancel.mockRestore()
    }
  })

  it('accepts a previously emitted position as a new command after a later echo', async () => {
    const view = await setup()
    view.start(0)
    view.move(-80)
    view.end(-80)
    view.start(0)
    view.move(80) // The user passes x=0 during this gesture.
    view.move(10)
    view.end(10) // Return to the min endpoint (-80).
    expect(view.page.root.style.transform).toContain('translateX(-80px)')
    view.page.rootInstance.watchX(-80) // Controlled state catches up with the final emitted value.
    view.page.rootInstance.watchX(0) // Business code deliberately closes the panel.
    expect(view.page.root.style.transform).toContain('translateX(0px)')
  })

  it('accepts a position passed during an unreported drag as a command after release', async () => {
    const view = await setup()
    view.start(0)
    view.move(-40)
    view.end(-80)
    expect(view.page.root.style.transform).toContain('translateX(-80px)')

    view.page.root.x = -40
    await view.page.waitForChanges()
    expect(view.page.root.style.transform).toContain('translateX(-40px)')
  })

  it('keeps Y echoes pending when X receives a command during a drag', async () => {
    const page = await newSpecPage({
      components: [MovableView],
      template: () => <taro-movable-view-core direction='all' snapThresholdX={40} snapThresholdY={20} animation={false} />,
    })
    page.root.getBoundingClientRect = () => ({ width: 40, height: 40 }) as DOMRect
    await page.rootInstance.setParent({ element: page.root, area: { width: 100, height: 100 } })
    const finger = (x: number, y: number) => ({ screenX: x, screenY: y })
    page.rootInstance.handleTouchStart({ touches: [finger(0, 0)] } as unknown as TouchEvent)
    page.rootInstance.handleTouchMove({ touches: [finger(10, 10)], preventDefault: jest.fn() } as unknown as TouchEvent)
    page.rootInstance.handleTouchMove({ touches: [finger(20, 20)], preventDefault: jest.fn() } as unknown as TouchEvent)

    page.root.x = -10
    await page.waitForChanges()
    page.root.y = 10
    await page.waitForChanges()
    expect(page.root.style.transform).toContain('translateY(20px)')
  })

  it('preserves an uncontrolled snap position when the area is measured again', async () => {
    const view = await setup()
    view.start(0)
    view.move(-60)
    view.end(-60)
    expect(view.page.root.style.transform).toContain('translateX(-80px)')
    await view.page.rootInstance.setParent({ element: view.page.root, area: { width: 300, height: 80 } })
    expect(view.page.root.style.transform).toContain('translateX(-60px)')
  })

  it('resumes an interrupted snap after a tap and cancels when the area changes', async () => {
    const frames = new Map<number, FrameRequestCallback>()
    let nextFrame = 0
    const raf = jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(callback => {
      frames.set(++nextFrame, callback)
      return nextFrame
    })
    const cancel = jest.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(id => { frames.delete(id) })
    const advance = (time: number) => {
      const [id, callback] = frames.entries().next().value
      frames.delete(id)
      callback(time)
    }
    try {
      const view = await setup(40, true)
      view.start(0)
      view.move(-60)
      view.end(-60)
      advance(0)
      advance(100)
      view.start(0)
      expect(frames.size).toBe(0)
      view.end(0)
      expect(frames.size).toBe(1)
      advance(100)
      advance(400)
      expect(view.page.root.style.transform).toContain('translateX(-80px)')

      view.start(0)
      view.move(60)
      view.end(60)
      advance(500)
      await view.page.rootInstance.setParent({ element: view.page.root, area: { width: 350, height: 80 } })
      expect(frames.size).toBe(0)
      expect(view.page.root.style.transform).toContain('translateX(-10px)')
      expect(view.changes[view.changes.length - 1]?.source).toBeUndefined()
    } finally {
      raf.mockRestore()
      cancel.mockRestore()
    }
  })
})
