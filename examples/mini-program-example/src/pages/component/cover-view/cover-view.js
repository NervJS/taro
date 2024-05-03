import './cover-view.scss'

import React from 'react'
import { View, Text, Image, CoverImage, CoverView } from '@tarojs/components'

import nervLogo from './nerv_logo.png'

import Header from '../../../components/head/head'
import ComponentState from '../../../components/component_state/component_state'

export default class PageView extends React.Component {
  render() {
    return (
      <View className='components-page'>
        <View className='components-page__header'>
          <Header title='CoverView'></Header>
          <ComponentState platform='H5' rate='100'>
            {' '}
          </ComponentState>
        </View>
        <View className='components-page__body'>
          <View className='page-section page-section-gap'>
            <Image style={{ width: '100%', height: '300px' }} src={nervLogo}>
              <CoverView class='cover-view' id='test'>
                <CoverView class='container'>
                  <CoverView class='flex-wrp' style='flex-direction:row;'>
                    <CoverView
                      class='flex-item demo-text-1'
                      style='overflow-y: scroll;'
                      scrollTop='1px'
                      fixedTop='1px'
                      fixedRight='1px'
                      fixedBottom='1px'
                      fixedLeft='1px'
                      ariaRole='角色'
                      ariaLabel='属性'
                      scrollX='true'
                      scrollY='true'
                      upperThreshold='1px'
                      lowerThreshold='1px'
                      scrollLeft='10px'
                      scrollIntoView='test'
                      scrollAnimationDuration='4ms'
                      scrollWithAnimation='true'
                      enableBackToTop='true'
                      trapScroll='true'
                      disableLowerScroll='out-of-bounds'
                      disableUpperScroll='always'
                      onScrollToUpper={() => {
                        console.log('onScrollToUpper success')
                      }}
                      onScrollToLower={() => {
                        console.log('onScrollToLower success')
                      }}
                      onScroll={() => {
                        console.log('onScroll success')
                      }}
                      onTouchStart={() => {
                        console.log('onTouchStart success')
                      }}
                      onTouchEnd={() => {
                        console.log('onTouchEnd success')
                      }}
                      onTouchMove={() => {
                        console.log('onTouchMove success')
                      }}
                      onTouchCancel={() => {
                        console.log('onTouchCancel success')
                      }}
                    ></CoverView>
                    <CoverView class='flex-item demo-text-2'></CoverView>
                    <CoverView class='flex-item demo-text-3'></CoverView>
                  </CoverView>
                </CoverView>
              </CoverView>
            </Image>
          </View>
        </View>
      </View>
    )
  }
}
