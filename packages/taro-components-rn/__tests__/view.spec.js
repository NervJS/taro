import React from 'react'
// import 'react-native'
import { _View } from '../src/components/view'
import renderer from 'react-test-renderer'

describe('<View />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <_View />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
