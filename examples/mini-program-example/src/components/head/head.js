import React from 'react'
import { View } from '@tarojs/components'

export default class Header extends React.Component {
  static options = {
    addGlobalClass: true
  }

  render () {
    return (
      <View className="page-head">
        <View className="page-head-title">{this.props.title}</View>
        <View className="page-head-line" />
        {!!this.props.desc ?
          (<View className="page-head-desc">{this.props.desc}</View>)
          : null}
      </View>
    )
  }
}
