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
