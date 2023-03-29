import React, { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'
import './avatar.scss'

export default class Avatar extends Component<{ mode: any, onAvatarClick: any }, null> {
  node: { ctx: any }

  handleClick () {
    if (process.env.TARO_ENV === 'jd') {
      this.node.ctx.triggerEvent('avatarClick')
    } else {
      this.node.ctx.triggerEvent('avatar-click')
    }
  }

  render () {
    return (
      <View ref={node => this.node = node} >
        <Text>triggerEvent 触发点击事件：</Text>
        <Image
          className='logo'
          src='http://storage.360buyimg.com/taro-static/static/images/logo.png'
          mode={this.props.mode}
          onClick={this.handleClick.bind(this)}
        />
        <Text>props 传递点击事件：</Text>
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
