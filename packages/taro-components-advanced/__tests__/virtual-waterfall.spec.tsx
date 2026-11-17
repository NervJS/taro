import React, { act } from 'react'
import { createRoot } from 'react-dom/client'

import Waterfall from '../src/components/virtual-waterfall/react/waterfall'

import type { Root } from 'react-dom/client'

jest.mock('@tarojs/runtime', () => ({
  cancelAnimationFrame: jest.fn(),
  document: { getElementById: jest.fn() },
  now: () => Date.now(),
  requestAnimationFrame: jest.fn()
}))
jest.mock('@tarojs/taro', () => ({
  createIntersectionObserver: jest.fn(),
  createSelectorQuery: jest.fn(),
  getCurrentInstance: jest.fn()
}))

// Scroll events are only filtered for shaking outside of the web platform
process.env.TARO_PLATFORM = 'web'

const originalActEnvironment = (globalThis as any).IS_REACT_ACT_ENVIRONMENT

function Item ({ id, index }: { id?: string, index?: number }) {
  return <div id={id}>{index}</div>
}

describe('VirtualWaterfall', () => {
  let container: HTMLDivElement
  let root: Root
  let consoleError: jest.SpyInstance
  let renderDepth: number
  let updatesDuringRender: number

  const renderWaterfall = (props: Partial<React.ComponentProps<typeof Waterfall>> = {}) => {
    act(() => {
      root.render(
        <Waterfall
          id='waterfall'
          column={2}
          height={300}
          width={400}
          item={Item}
          itemCount={20}
          itemSize={(index = 0) => 100 + index * 10}
          {...props}
        />
      )
    })
  }

  const getWrapperHeight = () => container.querySelector<HTMLElement>('#waterfall-wrapper')!.style.height

  beforeEach(() => {
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    // React only warns about render phase updates once per process, so also count them directly
    renderDepth = 0
    updatesDuringRender = 0
    const { render, setState } = Waterfall.prototype
    jest.spyOn(Waterfall.prototype, 'render').mockImplementation(function (this: Waterfall) {
      renderDepth++
      try {
        return render.call(this)
      } finally {
        renderDepth--
      }
    })
    jest.spyOn(Waterfall.prototype, 'setState').mockImplementation(function (this: Waterfall, ...args: Parameters<typeof setState>) {
      if (renderDepth > 0) updatesDuringRender++
      return setState.apply(this, args)
    })
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    jest.restoreAllMocks()
    ;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = originalActEnvironment
  })

  it('does not update state while rendering when items are laid out on mount', () => {
    renderWaterfall()

    expect(container.querySelector('#waterfall-0')).not.toBeNull()
    expect(updatesDuringRender).toBe(0)
    expect(consoleError).not.toHaveBeenCalledWith(
      expect.stringContaining('Cannot update during an existing state transition'),
      expect.anything()
    )
  })

  it('does not update state while rendering when more items are laid out by scrolling', () => {
    renderWaterfall()

    const outer = container.querySelector<HTMLElement>('#waterfall')!
    Object.defineProperties(outer, {
      scrollHeight: { configurable: true, value: 10000 },
      scrollWidth: { configurable: true, value: 400 },
      scrollTop: { configurable: true, value: 600 }
    })
    act(() => {
      outer.dispatchEvent(new Event('scroll', { bubbles: true }))
    })

    expect(container.querySelector('#waterfall-10')).not.toBeNull()
    expect(updatesDuringRender).toBe(0)
  })

  it('renders again after commit so the wrapper height includes items laid out during render', () => {
    renderWaterfall({ itemCount: 4, itemSize: () => 100 })

    // Each of the two columns ends up with two items
    expect(getWrapperHeight()).toBe('200px')
  })

  it('keeps refreshing synchronously when requested outside of render', () => {
    const ref = React.createRef<Waterfall>()
    act(() => {
      root.render(
        <Waterfall
          ref={ref}
          id='waterfall'
          column={2}
          height={300}
          width={400}
          item={Item}
          itemCount={4}
          itemSize={() => 100}
        />
      )
    })
    expect(getWrapperHeight()).toBe('200px')

    act(() => {
      ref.current!.itemMap.setSizeByPosition(0, 0, 500)
    })

    expect(getWrapperHeight()).toBe('600px')
  })
})
