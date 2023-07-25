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
          pages: ['view','scroll-view', 'cover-image','cover-view','sticky-header', 'movable-view', 'swiper','grid-view','list-view','page-container','match-media','root-portal','share-element'],
          target: [
            'cover-image','cover-view','grid-view','list-view',
            'match-media','movable-view','page-container',
            'root-portal','scroll-view','share-element','sticky-header',
            'swiper','view'
          ]
        },
        {
          id: 'content',
          name: '基础内容',
          open: false,
          pages: ['text', 'icon', 'progress'],
          target: ['icon','progress','rich-text','text']
        },
        {
          id: 'form',
          name: '表单组件',
          open: false,
          pages: [
            'button',
            'checkbox',
            'checkbox-group',
            'editor',
            'form',
            'input',
            'label',
            'picker',
            'picker-view',
            'radio',
            'radio-group',
            'slider',
            'switch',
            'textarea',
            'sticky-header'
          ],
          target: ['button','checkbox','checkbox-group','editor','form',
            'input','keyboard-accessory','label','picker','picker-view',
            'radio','radio-group','slider','switch','textarea'
          ]
        },
        {
          id: 'nav',
          name: '导航',
          open: false,
          pages: ['navigator'],
          target: ['functional-page-navigator', 'navigator', 'navigation-bar']
        },
        {
          id: 'media',
          name: '媒体组件',
          open: false,
          pages: ['image','audio','video','camera'],
          target: ['audio','camera','channel-live', 'channel-video','image', 'live-player', 'live-pusher', 'video','voip-room']
        },
        {
          id: 'map',
          name: '地图',
          pages: ['map'],
          target: ['map']
        },
        {
          id: 'canvas',
          name: '画布',
          pages: ['canvas'],
          target: ['canvas']
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
    Taro.navigateTo({
      url: page.url
    })
  }

  render () {

    var targetComponents = 0
    var pageComponents = 0
    this.state.list.map((item)=>{
      targetComponents += item.target.length
      pageComponents += item.pages.length
    })

    return (
      <View className='index'>
        <View className='index-hd'>
          <Image className='index-logo' src={logo} />
          <View className='index-desc'>
            <Text className='index-desc_text'>组件总数为：{targetComponents}，未创建Demo的组件数：{targetComponents - pageComponents}</Text>
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
                item._pages = item.target.map(targetPage => {
                  return {
                    page: targetPage,
                    url: `/pages/component/${targetPage}/${targetPage}`,
                    state: item.pages.includes(targetPage) ? 'done':'undo'
                  }
                })
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
                        {item._pages.map((page, index) => {
                          return (
                            <View
                              onClick={this.goToComponent.bind(this, page)}
                              key={index}
                              className='navigator'
                            >
                              <Text className='navigator-text'>
                                {page.page}
                                {
                                  page.state == 'undo' && (<Text className='navigator-state tag'>未创建Demo</Text>)
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
