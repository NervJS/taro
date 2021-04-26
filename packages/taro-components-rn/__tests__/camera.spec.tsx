// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import renderer from 'react-test-renderer'
import { _Camera } from '../src/components/Camera'

describe('Camera', () => {
  it('render Camera with default props', () => {
    const tree = renderer.create(<_Camera id='id' ratio='' />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
