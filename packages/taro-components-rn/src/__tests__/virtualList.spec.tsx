import { render } from '@testing-library/react-native'
import * as React from 'react'
import { View } from 'react-native'

import VirtualList from '../components/VirtualList'

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
    // @ts-ignore
    const { toJSON } = render(<VirtualList>{Row}</VirtualList>)
    expect(toJSON()).toMatchSnapshot()
  })
})
