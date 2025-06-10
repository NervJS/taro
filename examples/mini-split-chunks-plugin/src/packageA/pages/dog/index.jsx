import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { sm4 } from 'miniprogram-sm-crypto'
import { AtButton } from 'taro-ui'
import Info from '../../../pages/components/info/index'
import './index.scss'
import '../../common/index.scss'


export default class Index extends Component {

  componentWillMount () {
    const msg = 'hello world!' // 可以为 utf8 串或字节数组
    const key = '0123456789abcdeffedcba9876543210' // 可以为 16 进制串或字节数组，要求为 128 比特

    this.setState({
      encryptData: sm4.encrypt(msg, key) // 加密，默认输出 16 进制字符串，默认使用 pkcs#7 填充（传 pkcs#5 也会走 pkcs#7 填充）
    })
   }

  componentDidMount () {

   }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { encryptData = '' } = this.state
    return (
      <View className='dog detail'>
        <Text>Dog!</Text>
        <Text>编号：{encryptData.slice(0, 6)}</Text>
        <AtButton type='primary' size='small' onClick={() => {}}>回家</AtButton>
        <Info text='吃饭' />
      </View>
    )
  }
}
