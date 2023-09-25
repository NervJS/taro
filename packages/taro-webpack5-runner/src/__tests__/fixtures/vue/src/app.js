import Vue from 'vue'
import './app.css'

const App = new Vue({
  onShow () {
  },
  render (h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  }
})

export default App
