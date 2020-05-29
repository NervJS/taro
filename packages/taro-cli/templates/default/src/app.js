<%if (framework === 'react') {-%>
import { Component } from 'react'
<%} else if (framework === 'nerv') { -%>
import { Component } from 'nervjs'
<%} else if (framework === 'vue') { -%>
import Vue from 'vue'
<%}-%>
import './app.<%= cssExt %>'

<% if (framework === 'react' || framework === 'nerv') { -%>
class App extends Component {

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}
<%}-%>
<% if (framework === 'vue') { -%>
const App = new Vue({
  onShow (options) {
  },
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  }
})
<%}-%>

export default App
