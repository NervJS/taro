import * as React from 'react'
import { render } from '@testing-library/react-native'
import MovableView from '../components/MovableView'

describe('MovableView', () => {
  it('MovableView render', () => {
    const { getByTestId } = render(<MovableView
      direction='all'
      onDragStart={jest.fn}
      onDragEnd={jest.fn}
      onMove={jest.fn}
      layout={{
        width: 100,
        height: 100,
      }}
    />)
    expect(getByTestId('movableView')).toHaveStyle({
      left: 0,
      top: 0,
    })
  })
})
