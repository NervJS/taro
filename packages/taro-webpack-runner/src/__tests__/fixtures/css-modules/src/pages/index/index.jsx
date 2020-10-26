import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import moduleStyles from './index.module.css'
import styles from './index.css'
import '../../index.global.css'

export default class Index extends Component {
  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className={moduleStyles.cbody}>
        <Text className={`${moduleStyles.ctext} ${styles.cwrapper}`}>Hello world!</Text>
      </View>
    )
  }
}
