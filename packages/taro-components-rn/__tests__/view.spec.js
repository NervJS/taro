import 'react-native'
import React from 'react'
import View from '../src/components/view'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer
    .create(
      <View />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
