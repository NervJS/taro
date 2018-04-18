import 'react-native'
import React from 'react'
import Icon from '../src/components/icon'
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(
    <Icon type='success' size={50} color='green' />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
