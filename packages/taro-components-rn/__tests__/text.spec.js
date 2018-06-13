import React from 'react'
// import 'react-native'
import { shallow } from 'enzyme'
import Text from '../src/components/text'
import renderer from 'react-test-renderer'



describe('<Text />', () => {
  // it('renders correctly', () => {
  //   const tree = renderer
  //     .create(
  //       <Text>Alo, alo, holy high!</Text>
  //     )
  //     .toJSON()
  //   expect(tree).toMatchSnapshot()
  // })

  it('simple structure check', () => {
    const wrapper = shallow(<Text>Miao miao miao~</Text>)
    expect(wrapper.childAt(0).text()).toContain('Miao miao miao~')
  })
})
