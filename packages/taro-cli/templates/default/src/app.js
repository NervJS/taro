<%if (['react', 'preact'].includes(framework)) {-%>
<% if (typescript) {%>import { PropsWithChildren } from 'react'<%}%>
import { useLaunch } from '@tarojs/taro'
<%} else if (framework === 'vue') { -%>
import Vue from 'vue'
<%} else if (framework === 'vue3') { -%>
import { createApp } from 'vue'
<%}-%>
import './app.<%= cssExt %>'

<% if (['react', 'preact'].includes(framework)) { -%>
function App({ children }<% if (typescript) {%>: PropsWithChildren<%}%>) {

  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  return children
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
