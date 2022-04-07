import * as React from 'react'
import { View, Text } from 'react-native'
import { fireEvent, render } from '@testing-library/react-native'
import MovableArea from '../components/MovableArea'

describe('MovableArea', () => {
  it('MovableArea emit layout', () => {
    const { getByTestId } = render(<MovableArea
      animation={false}
      direction='all'
      onDragStart={jest.fn()}
      onDragEnd={jest.fn()}
      onMove={jest.fn()}
    ><View><Text>content</Text></View></MovableArea>)
    const view = getByTestId('moveableArea')
    const event = {
      nativeEvent: {
        layout: {
          width: 200,
          height: 200,
        }
      }
    }
    expect(view).toHaveStyle({
      height: 100,
    })
    fireEvent(view, 'Layout', event)
    expect(view).toHaveStyle({
      height: 200,
    })
  })
})
