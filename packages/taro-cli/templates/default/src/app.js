{{#if (includes "React" "Preact" s=framework)}}
{{#if typescript }}import { PropsWithChildren } from 'react'{{/if}}
import { useLaunch } from '@tarojs/taro'
{{/if}}{{#if (eq framework 'Vue') }}
import Vue from 'vue'
{{/if}}{{#if (eq framework 'Vue3') }}
import { createApp } from 'vue'
{{/if}}
import './app.{{ cssExt }}'

{{#if (includes "React" "Preact" s=framework)}}
function App({ children }{{#if typescript }}: PropsWithChildren<any>{{/if}}) {

  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  return children
}
{{/if}}
{{#if (eq framework 'Vue') }}
const App = {
  onShow (options) {
    console.log('App onShow.')
  },
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  }
}
{{/if}}
{{#if (eq framework 'Vue3') }}
const App = createApp({
  onShow (options) {
    console.log('App onShow.')
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
{{/if}}

export default App
