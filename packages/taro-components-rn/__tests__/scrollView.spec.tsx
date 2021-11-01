// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import ScrollView from '../src/components/ScrollView'

describe('ScrollView', () => {
  it('ScrollView render', () => {
    const wrapper = shallow(<ScrollView>scroll me</ScrollView>)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
