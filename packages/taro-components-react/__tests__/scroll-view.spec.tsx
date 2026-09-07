import { render } from '@testing-library/react'
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
})
