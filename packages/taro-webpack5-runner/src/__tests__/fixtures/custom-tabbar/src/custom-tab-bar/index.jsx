import React, { Component } from 'react'
import { CoverView, CoverImage } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.css'

export default class Index extends Component {
  render () {
    return (
      <CoverView>
        <CoverView onClick={() => {
          Taro.switchTab({ url: '/pages/index/index' })
        }}>
          Index
          <CoverImage className='icon' src='../assets/view_red.png' />
        </CoverView>
        <CoverView onClick={() => {
          Taro.switchTab({ url: '/pages/detail/index' })
        }}>
          Detail
          <CoverImage className='icon' src='../assets/nav.png' />
        </CoverView>
      </CoverView>
    )
  }
}
