import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { sm4 } from 'miniprogram-sm-crypto'
import Label from '../../../components/label/index'
import './index.scss'

export default class Index extends Component {

  componentWillMount () {
    const msg = 'hello world! 我是 juneandgreen.' // 可以为 utf8 串或字节数组
    const key = '0123456789abcdeffedcba9876543210' // 可以为 16 进制串或字节数组，要求为 128 比特

    this.setState({
      encryptData: sm4.encrypt(msg, key) // 加密，默认输出 16 进制字符串，默认使用 pkcs#7 填充（传 pkcs#5 也会走 pkcs#7 填充）
    })
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { encryptData = '' } = this.state
    return (
      <View className='apple'>
        <Text>Apple!</Text>
        <Text>编号：{encryptData.slice(0, 6)}</Text>
        <Label text='熟了' />
      </View>
    )
  }
}
