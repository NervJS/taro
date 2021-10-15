// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import MovableView from '../src/components/MovableView'

describe('MovableView', () => {
  it('MovableView render', () => {
    const wrapper = shallow(<MovableView
      direction='all'
      onDragStart={jest.fn}
      onDragEnd={jest.fn}
      onMove={jest.fn}
      layout={{
        width: 100,
        height: 100,
      }}
    />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
