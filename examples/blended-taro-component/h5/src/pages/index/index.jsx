import React, { Component } from 'react'
import { View } from '@tarojs/components'

import Picker from '../../taro/components/picker/index'

export default class Index extends Component {
  render () {

    return (
      <View>
        hello world
        <Picker 
          list={['a', 'b', 'c']}
          title="test"
          onButtonClick={() => {
            console.log('click 1')
          }}
        />
      </View>
    )
  }
}
