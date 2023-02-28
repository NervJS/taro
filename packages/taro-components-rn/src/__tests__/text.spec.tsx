import * as React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import Text from '../components/Text'

describe('<Text />', () => {
  it('simple structure check', () => {
    const { getByText } = render(<Text>Miao miao miao~</Text>)
    expect(getByText('Miao miao miao~')).toHaveTextContent('Miao miao miao~')
  })

  it('onClick', () => {
    const onClick = jest.fn()
    const { getByText } = render(<Text onClick={onClick}>Test Text</Text>)
    fireEvent.press(getByText('Test Text'))
    expect(onClick).toHaveBeenCalled()
  })
})
