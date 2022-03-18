import * as React from 'react'
import { render } from '@testing-library/react-native'
import { _Camera } from '../components/Camera'

describe('Camera', () => {
  it('render Camera with default props', () => {
    const tree = render(<_Camera id='id' ratio='' />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
