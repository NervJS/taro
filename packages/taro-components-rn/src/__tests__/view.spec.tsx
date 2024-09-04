import { render } from '@testing-library/react-native'
import * as React from 'react'

import { _View } from '../components/View'

describe('<View />', () => {
  it('renders view with text correctly', () => {
    // @ts-ignore
    const { getByText } = render(<_View style={{ color: 'red' }}>Hello</_View>)
    expect(getByText('Hello')).toHaveStyle({
      color: 'red'
    })
  })
})
