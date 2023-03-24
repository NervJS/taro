import React, { Component } from 'react'
import { View, Image } from '@tarojs/components'
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
        <Image
          className='logo'
          src='http://storage.360buyimg.com/taro-static/static/images/logo.png'
          mode={this.props.mode}
          onClick={this.props.onAvatarClick}
        />
        <Child onClick={this.handleClick.bind(this)} />
      </View>
    )
  }
}

class Child extends Component<{ onClick: any }> {
  render () {
    return (
      <View onClick={this.props.onClick}>
        Child
      </View>
    )
  }
}
