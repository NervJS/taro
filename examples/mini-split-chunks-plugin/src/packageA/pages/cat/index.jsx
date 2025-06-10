import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import './index.scss'
import '../../common/index.scss'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='cat detail'>
        <Text>Cat!</Text>
        <View className='taro-button'>
          <AtButton type='primary' size='small' onClick={() => {}}>喂食</AtButton>
        </View>
      </View>
    )
  }
}
