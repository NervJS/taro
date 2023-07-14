import './cover-view.scss'

import React from 'react'
import { View, Text, Image, CoverImage, CoverView } from '@tarojs/components'

import nervLogo from './nerv_logo.png'

import Header from '../../../components/head/head'
import ComponentState from "../../../components/component_state/component_state";

export default class PageView extends React.Component {
  render() {
    return (
      <View className='components-page'>
        <View className='components-page__header'>
          <Header title='CoverView'></Header>
           <ComponentState platform='H5' rate='100'> </ComponentState>
        </View>
        <View className='components-page__body'>
          <View className="page-section page-section-gap">
            <Image
              style={{width: '100%', height: '300px'}}
              src={nervLogo}
            >
              <CoverView class="cover-view">
                <CoverView class="container">
                  <CoverView class="flex-wrp" style="flex-direction:row;">
                    <CoverView class="flex-item demo-text-1"></CoverView>
                    <CoverView class="flex-item demo-text-2"></CoverView>
                    <CoverView class="flex-item demo-text-3"></CoverView>
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
