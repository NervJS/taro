import 'react-native'
import React from 'react'
import Text from '../src/components/text'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer
    .create(
      <Text>Alo, alo, holy high!</Text>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
