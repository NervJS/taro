import './index.scss'

// eslint-disable-next-line import/first
import Taro, { Component } from '@tarojs/taro'
import React from 'react'
import { View, Image, Text } from '@tarojs/components'
import logo from '../../../assets/component/logo.png'
import viewPng from '../../../assets/component/view.png'
import contentPng from '../../../assets/component/content.png'
import formPng from '../../../assets/component/form.png'
import navPng from '../../../assets/component/nav.png'
import mediaPng from '../../../assets/component/media.png'
import mapPng from '../../../assets/component/map.png'
import canvasPng from '../../../assets/component/canvas.png'

const PNGS = {
  viewPng,
  contentPng,
  formPng,
  navPng,
  mediaPng,
  mapPng,
  canvasPng
}

export default class Index extends React.Component {
  constructor () {
    super(...arguments)
    this.state = {
      list: [
        {
          id: 'view',
          name: '视图容器',
          open: false,
          pages: [
            {name:'cover-image', pageName:''},
            {name:'cover-view', pageName:''},
            {name:'grid-view', pageName:'grid-view'},
            {name:'list-view', pageName:'list-view'},
            {name:'match-media', pageName:'match-media'},
            {name:'movable-area', pageName:''},
            {name:'movable-view', pageName:''},
            {name:'page-container', pageName:'page-container'},
            {name:'root-portal', pageName:'root-portal'},
            {name:'scroll-view', pageName:'scroll-view'},
            {name:'share-element', pageName:''},
            {name:'sticky-header', pageName:''},
            {name:'sticky-section', pageName:''},
            {name:'swiper', pageName:'swiper'},
            {name:'swiper-item', pageName:''},
            {name:'view', pageName:'view'}
          ]
        },
        {
          id: 'content',
          name: '基础内容',
          open: false,
          pages: [
            {name:'icon', pageName:'icon'},
            {name:'progress', pageName:'progress'},
            {name:'rich-text', pageName:''},
            {name:'text', pageName:'text'},
          ]
        },
        {
          id: 'form',
          name: '表单组件',
          open: false,
          pages: [
            {name:'button', pageName:'button'},
            {name:'checkbox', pageName:'checkbox'},
            {name:'checkbox-group', pageName:'checkbox-group'},
            {name:'editor', pageName:''},
            {name:'form', pageName:'form'},
            {name:'input', pageName:'input'},
            {name:'label', pageName:'label'},
            {name:'keyboard-accessory', pageName:''},
            {name:'picker', pageName:'picker'},
            {name:'picker-view', pageName:'picker-view'},
            {name:'picker-view-column', pageName:''},
            {name:'radio', pageName:'radio'},
            {name:'radio-group', pageName:'radio-group'},
            {name:'slider', pageName:'slider'},
            {name:'switch', pageName:'switch'},
            {name:'textarea', pageName:'textarea'},
            {name:'sticky-header', pageName: 'sticky-header'}
          ]
        },
        {
          id: 'nav',
          name: '导航',
          open: false,
          pages: [
            {name:'functional-page-navigator', pageName:''},
            {name:'navigator', pageName:'navigator'},
            {name:'navigation-bar', pageName:''}
          ]
        },
        {
          id: 'media',
          name: '媒体组件',
          open: false,
          pages: [
            {name:'audio', pageName:'audio'},
            {name:'camera', pageName:'camera'},
            {name:'channel-live', pageName:''},
            {name:'channel-video', pageName:''},
            {name:'image', pageName:'image'},
            {name:'live-player', pageName:''},
            {name:'live-pusher', pageName:''},
            {name:'video', pageName:'video'},
            {name:'voip-room', pageName:''}
          ]
        },
        {
          id: 'map',
          name: '地图',
          pages: [
            {name:'map', pageName:'map'}
          ]
        },
        {
          id: 'canvas',
          name: '画布',
          pages: [
            {name:'canvas', pageName:'canvas'}
          ]
        }
      ]
    }
  }

  kindToggle = e => {
    const id = e.currentTarget.id
    const list = this.state.list
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setState({
      list: list
    })
  }

  goToComponent = (page, e) => {
    if (page.pageName == '') {
      // 弹出Toast提示
      Taro.showToast({
        title: `${page.name} 没有适配或没有创建Demo`,
        icon: 'error',
        success: ()=>{},
        fail: ()=>{},
        complete: ()=>{}
      })
      return ;
    }
    Taro.navigateTo({
      url: `/pages/component/${page.pageName}/${page.pageName}`
    })

  }

  render () {
    var componentPages = 0
    var noDemoComponents = 0
    this.state.list.map((item)=>{
      componentPages += item.pages.length
      noDemoComponents += item.pages.filter((page)=>page.pageName == '').length
    })

    return (
      <View className='index'>
        <View className='index-hd'>
          <Image className='index-logo' src={logo} />
          <View className='index-desc'>
            <Text className='index-desc_text'>组件总数为：{componentPages}，未创建Demo的组件数：{noDemoComponents}</Text>
          </View>
        </View>
        <View className='index-bd'>
          <View className='kind-list'>
            {this.state.list
              .map((item, index) => {
                item.hdClass =
                  'kind-list-item-hd ' +
                  (item.open ? 'kind-list-item-hd-show' : '')
                item.bdClass =
                  'kind-list-item-bd ' +
                  (item.open ? 'kind-list-item-bd-show' : '')
                item.boxClass =
                  'navigator-box ' + (item.open ? 'navigator-box-show' : '')
                item.imgSrc = PNGS[`${item.id}Png`]
                // item._pages = item.target.map(targetPage => {
                //   return {
                //     page: targetPage,
                //     url: `/pages/component/${targetPage}/${targetPage}`,
                //     state: item.pages.includes(targetPage) ? 'done':'undo'
                //   }
                // })
                return item
              })
              .map((item, index) => {
                return (
                  <View className='kind-list-item' key={index}>
                    <View
                      id={item.id}
                      className={item.hdClass}
                      onClick={this.kindToggle}>
                      <View className='kind-list-text'>
                        <Text>{item.name}</Text>
                      </View>
                      <Image className='kind-list-img' src={item.imgSrc} />
                    </View>
                    <View className={item.bdClass}>
                      <View className={item.boxClass}>
                        {item.pages.map((page, index) => {
                          return (
                            <View
                              onClick={this.goToComponent.bind(this, page)}
                              key={index}
                              className='navigator'
                            >
                              <Text className='navigator-text'>
                                {page.name}
                                {
                                  page.pageName == '' && (<Text className='navigator-state tag'>未创建Demo</Text>)
                                }
                              </Text>
                              <View className='navigator-arrow' />
                            </View>
                          )
                        })}
                      </View>
                    </View>
                  </View>
                )
              })}
          </View>
        </View>
      </View>
    )
  }
}
