import React, { Component } from 'react'
import { View, Image } from '@tarojs/components'
import './avatar.scss'

export default class Avatar extends Component<{ mode: any, onAvatarClick: any }, null> {
  render () {
    return (
      <View>
        <Image
          className='logo'
          src='http://storage.360buyimg.com/taro-static/static/images/logo.png'
          mode={this.props.mode}
          onClick={this.props.onAvatarClick}
        />
      </View>
    )
  }
}
