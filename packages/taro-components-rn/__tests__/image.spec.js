import 'react-native'
import React from 'react'
import Image from '../src/components/image'
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const mockOnErrorCallback = jest.fn()
  const tree = renderer.create(
    <Image
      src='https://alo'
      onError={() => {
        mockOnErrorCallback()
      }}
    />
  ).toJSON()
  // expect(mockOnErrorCallback.mock.calls.length).toBe(1)
  expect(tree).toMatchSnapshot()
})
