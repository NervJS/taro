// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import { _View } from '../src/components/View'
import * as renderer from 'react-test-renderer'

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
