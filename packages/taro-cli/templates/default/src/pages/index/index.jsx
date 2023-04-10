<%if (['react', 'preact'].includes(framework)) {-%>
import { Component<% if (typescript) {%>, PropsWithChildren<%}%> } from 'react'
<%}-%>
import { View, Text } from '@tarojs/components'
import './index.<%= cssExt %>'

<%if (['react', 'preact'].includes(framework)) {-%>
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
<%}-%>
<%if (['solid'].includes(framework)) {-%>
export default function Index() {
  return (
    <View class='<%= pageName %>'>
      <Text>Hello world!</Text>
    </View>
  );
}
<%}-%>