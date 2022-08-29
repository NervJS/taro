<%if (['react', 'preact'].includes(framework)) {-%>
import { Component<% if (typescript) {%>, PropsWithChildren<%}%> } from 'react'
<%}-%>
import { View, Text } from '@tarojs/components'
import './index.<%= cssExt %>'

export default class <%= _.capitalize(pageName) %> extends <% if (typescript) {%>Component<PropsWithChildren><%} else {%>Component<%}%> {

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
