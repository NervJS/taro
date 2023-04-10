<%if (['react', 'preact'].includes(framework)) {-%>
import { Component<% if (typescript) {%>, PropsWithChildren<%}%> } from 'react'
<%} else if (framework === 'vue') { -%>
import Vue from 'vue'
<%} else if (framework === 'vue3') { -%>
import { createApp } from 'vue'
<%}-%>
import './app.<%= cssExt %>'

<% if (['react', 'preact'].includes(framework)) { -%>
class App extends <% if (typescript) {%>Component<PropsWithChildren><%} else {%>Component<%}%> {

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  render () {
    // this.props.children 是将要会渲染的页面
    return this.props.children
  }
}
<%}-%>
<% if (framework === 'vue') { -%>
const App = {
  onShow (options) {
  },
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  }
}
<%}-%>
<% if (framework === 'vue3') { -%>
const App = createApp({
  onShow (options) {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
<%}-%>

export default App
