import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { MovableArea } from '../src/components/movable-area/movable-area'
import { MovableView } from '../src/components/movable-area/movable-view'

describe('MovableArea', () => {
  let page: SpecPage

  it('base', async () => {
    page = await newSpecPage({
      components: [MovableArea, MovableView],
      template: () => (<taro-movable-area-core style='height: 200px; width: 200px; background: red;'>
        <taro-movable-view-core style='height: 50px; width: 50px; background: blue;' direction='all'>
          带我走
        </taro-movable-view-core>
      </taro-movable-area-core>),
    })
    expect(page.root).toMatchSnapshot()
  })

  it('measures only new views when children change', async () => {
    const OriginalObserver = globalThis.MutationObserver
    let onMutation: MutationCallback | undefined
    globalThis.MutationObserver = class {
      constructor (callback: MutationCallback) { onMutation = callback }
      observe () {}
      disconnect () {}
    } as unknown as typeof MutationObserver
    let getComputedStyle: jest.SpyInstance
    try {
      page = await newSpecPage({
        components: [MovableArea],
        html: '<taro-movable-area-core></taro-movable-area-core>',
      })
      getComputedStyle = jest.spyOn(window, 'getComputedStyle').mockReturnValue({
        borderLeftWidth: '0px',
        borderRightWidth: '0px',
        borderTopWidth: '0px',
        borderBottomWidth: '0px',
        paddingLeft: '0px',
        paddingRight: '0px',
        paddingTop: '0px',
        paddingBottom: '0px',
      } as CSSStyleDeclaration)
      page.root.getBoundingClientRect = () => ({ width: 280, height: 80 }) as DOMRect
      const view = document.createElement('taro-movable-view-core')
      const setParent = jest.fn(() => { view.style.transform = 'translateX(0px)' })
      view.setParent = setParent
      page.root.appendChild(view)
      onMutation?.([{ type: 'childList', target: page.root } as MutationRecord], {} as MutationObserver)
      expect(setParent).toHaveBeenCalledWith({ element: page.root, area: { width: 280, height: 80 } })

      view.style.transform = 'translateX(20px)'
      const sibling = document.createElement('div')
      page.root.appendChild(sibling)
      onMutation?.([{ type: 'childList', target: page.root } as MutationRecord], {} as MutationObserver)
      expect(setParent).toHaveBeenCalledTimes(1)
      expect(view.style.transform).toBe('translateX(20px)')

      const added = document.createElement('taro-movable-view-core')
      const setAddedParent = jest.fn()
      added.setParent = setAddedParent
      page.root.appendChild(added)
      onMutation?.([{ type: 'childList', target: page.root } as MutationRecord], {} as MutationObserver)
      expect(setAddedParent).toHaveBeenCalledWith({ element: page.root, area: { width: 280, height: 80 } })
      expect(setParent).toHaveBeenCalledTimes(1)
      expect(view.style.transform).toBe('translateX(20px)')

      page.root.appendChild(document.createElement('div'))
      Object.defineProperty(page.root, 'offsetWidth', { configurable: true, value: 300 })
      page.root.getBoundingClientRect = () => ({ width: 300, height: 80 }) as DOMRect
      onMutation?.([
        { type: 'childList', target: page.root } as MutationRecord,
        { type: 'attributes', attributeName: 'style', target: page.root } as MutationRecord,
      ], {} as MutationObserver)
      expect(setParent).toHaveBeenCalledWith({ element: page.root, area: { width: 300, height: 80 } })
      expect(setAddedParent).toHaveBeenCalledWith({ element: page.root, area: { width: 300, height: 80 } })
    } finally {
      getComputedStyle?.mockRestore()
      globalThis.MutationObserver = OriginalObserver
    }
  })
})
