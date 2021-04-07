// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import { View } from 'react-native'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import VirtualList from '../src/components/VirtualList'
const Row = React.memo(props => {
  const ctx: any = props
  const { index, style, data } = ctx
  return (
    <View style={style}>
      Row {index} : {data[index]}
    </View>
  )
})

describe('VirtualList', () => {
  it('VirtualList render', () => {
    // eslint-disable-next-line
    // @ts-ignore
    const wrapper = shallow(<VirtualList>{Row}</VirtualList>)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
