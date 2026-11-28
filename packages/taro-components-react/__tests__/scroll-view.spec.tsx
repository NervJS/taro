import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import ScrollView from '../src/components/scroll-view'

describe('ScrollView', () => {
  it('should pass id to the root element', () => {
    const { container } = render(
      <ScrollView id='scroll-container' scrollY>
        content
      </ScrollView>
    )

    expect(container.firstChild).toHaveAttribute('id', 'scroll-container')
  })

  it('should stop touchmove propagation by default', () => {
    const onTouchMove = jest.fn()
    const { getByText } = render(
      <div onTouchMove={onTouchMove}>
        <ScrollView>content</ScrollView>
      </div>
    )

    fireEvent.touchMove(getByText('content'))

    expect(onTouchMove).not.toHaveBeenCalled()
  })

  it('should allow touchmove propagation when disabled', () => {
    const onTouchMove = jest.fn()
    const { getByText } = render(
      <div onTouchMove={onTouchMove}>
        <ScrollView stopTouchMovePropagation={false}>content</ScrollView>
      </div>
    )

    fireEvent.touchMove(getByText('content'))

    expect(onTouchMove).toHaveBeenCalledTimes(1)
  })
})

describe('ScrollView anchor offsets', () => {
  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  it.each([-20, 0, 20])('applies offset %s only to the matching container', offset => {
    jest.useFakeTimers()
    const nativeScroll = jest.fn()
    const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollTo')
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', { configurable: true, value: nativeScroll })
    const rect = (top: number, height: number) => ({
      top, left: 0, right: 200, bottom: top + height, width: 200, height, x: 0, y: top, toJSON() {},
    })
    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
      return rect(this.id === 'anchor' ? 160 : 10, 20)
    })
    const { container } = render(
      <ScrollView scrollY scrollWithAnimation={false} scrollIntoView='anchor' scrollIntoViewAlignment='start' scrollIntoViewOffset={offset}>
        <div id='anchor'>target</div>
      </ScrollView>
    )
    const root = container.querySelector('.taro-scroll-view') || container.firstElementChild!
    try {
      jest.runOnlyPendingTimers()
      expect(nativeScroll).toHaveBeenLastCalledWith({ top: 150 + offset, behavior: 'auto' })
      expect(nativeScroll.mock.instances.every(instance => instance === root)).toBe(true)
    } finally {
      if (descriptor) Object.defineProperty(HTMLElement.prototype, 'scrollTo', descriptor)
      else Reflect.deleteProperty(HTMLElement.prototype, 'scrollTo')
    }
  })
})
