import React, { act } from 'react'
import { createRoot } from 'react-dom/client'

import List from '../src/components/virtual-list/react/list'

import type { Root } from 'react-dom/client'

jest.mock('@tarojs/runtime', () => ({ document: { getElementById: jest.fn() }, now: () => Date.now() }))
jest.mock('@tarojs/taro', () => ({
  createIntersectionObserver: jest.fn(),
  createSelectorQuery: jest.fn(),
  getCurrentInstance: jest.fn()
}))

const originalActEnvironment = (globalThis as any).IS_REACT_ACT_ENVIRONMENT

function Item ({ id, index }: { id?: string, index?: number }) {
  return <div id={id}>{index}</div>
}

describe('VirtualList', () => {
  let container: HTMLDivElement
  let root: Root
  let consoleError: jest.SpyInstance
  let renderDepth: number
  let updatesDuringRender: number

  beforeEach(() => {
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    // React only warns about render phase updates once per process, so also count them directly
    renderDepth = 0
    updatesDuringRender = 0
    const { render, setState } = List.prototype
    jest.spyOn(List.prototype, 'render').mockImplementation(function (this: List) {
      renderDepth++
      try {
        return render.call(this)
      } finally {
        renderDepth--
      }
    })
    jest.spyOn(List.prototype, 'setState').mockImplementation(function (this: List, ...args: Parameters<typeof setState>) {
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

  it('does not update state while rendering when item sizes are measured', () => {
    act(() => {
      root.render(
        <List
          id='list'
          height={300}
          width={400}
          item={Item}
          itemCount={20}
          itemSize={(index = 0) => 100 + index}
        />
      )
    })

    expect(container.querySelector('#list-0')).not.toBeNull()
    expect(updatesDuringRender).toBe(0)
    expect(consoleError).not.toHaveBeenCalledWith(
      expect.stringContaining('Cannot update during an existing state transition'),
      expect.anything()
    )
  })
})
