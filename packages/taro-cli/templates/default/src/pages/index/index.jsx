<%if (framework === 'react') {-%>
import React, { Component } from 'react'
<%} else if (framework === 'nerv') { -%>
import Nerv, { Component } from 'nervjs'
<%}-%>
import { View, Text } from '@tarojs/components'
import './index.<%= cssExt %>'

export default class <%= _.capitalize(pageName) %> extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='<%= pageName %>'>
        <Text>Hello world!</Text>
      </View>
    )
  }
}
