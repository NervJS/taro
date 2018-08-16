import React, { Component } from 'react'
import { View, Icon } from '../src'

export default class EXIcon extends Component {
  render () {
    return (
      <View>
        {/* <Icon type='circle' /> */}
        <Icon type='download' />
        <Icon type='info' />
        {/* <Icon type='safe_success' /> */}
        {/* <Icon type='safe_warn' /> */}
        <Icon type='success' />
        {/* <Icon type='success_circle' /> */}
        <Icon type='success_no_circle' />
        <Icon type='waiting' />
        {/* <Icon type='waiting_circle' /> */}
        <Icon type='warn' />
        {/* <Icon type='info_circle' /> */}
        <Icon type='cancel' />
        <Icon type='search' />
        <Icon type='clear' />
        {/* <Icon type='back' /> */}
        {/* <Icon type='delete' /> */}
        <Icon type='waiting' color='purple' size={46} />
      </View>
    )
  }
}
