import * as React from 'react'

let R: typeof React

if (process.env.FRAMEWORK === 'nerv') {
  R = require('nervjs')
}

if (process.env.FRAMEWORK === 'react') {
  R = require('react')
}

export const createPullDownRefresh = (el, framework: 'react' | 'vue' | 'nerv'): any => {  
  return framework === 'vue' ? el : createReactPullDown(el)
}

const createReactPullDown = (el) => {
  return React.forwardRef((props, ref) => {
    return R.createElement('taro-pull-to-refresh', null, R.createElement(el, { ...props, ref }))
  })
}
