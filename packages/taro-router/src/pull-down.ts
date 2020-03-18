import * as React from 'react'
import VueCtor, { ComponentOptions } from 'vue'
import { injectPageInstance } from '@tarojs/runtime'

let R: typeof React

if (process.env.FRAMEWORK === 'nerv') {
  R = require('nervjs')
}

if (process.env.FRAMEWORK === 'react') {
  R = require('react')
}

let Vue
// webpack 开发模式不会执行 tree-shaking，因此我们需要做此判断
if (process.env.FRAMEWORK === 'vue') {
  const v = require('vue')
  Vue = v.default || v
}

export const createPullDownRefresh = (el, framework: 'react' | 'vue' | 'nerv', path: string): any => {  
  return framework === 'vue' ? createVuePullDown(el, path) : createReactPullDown(el)
}

const createReactPullDown = (el) => {
  return React.forwardRef((props, ref) => {
    return R.createElement('taro-pull-to-refresh', null, R.createElement(el, { ...props, ref }))
  })
}

const createVuePullDown = (el, path: string) => {
  const injectedPage = Vue.extend({
    props: {
      tid: String
    },
    mixins: [el, {
      created () {
        injectPageInstance(this, path)
      }
    }]
  })

  const options: ComponentOptions<VueCtor> = {
    name: 'PullToRefresh',
    render (h) {
      return h('taro-pull-to-refresh', { class: ['hydrated'] }, [h(injectedPage, this.$slots.default)])
    }
  }

  return options
}