import './index.scss'

// eslint-disable-next-line import/first
import Taro, { Component } from '@tarojs/taro'
import React from 'react'
import { View, Image, Text } from '@tarojs/components'
import logo from '../../../../assets/component/logo.png'
import viewPng from '../../../../assets/component/view.png'
import contentPng from '../../../../assets/component/content.png'
import formPng from '../../../../assets/component/form.png'
import navPng from '../../../../assets/component/nav.png'
import mediaPng from '../../../../assets/component/media.png'
import mapPng from '../../../../assets/component/map.png'
import canvasPng from '../../../../assets/component/canvas.png'

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
          id: 'base',
          name: '基础',
          open: false,
          pages: [
            {name:'调试 API', pageName: ''},
            {name:'系统 API', pageName: ''},
            {name:'更新 API', pageName: ''},
            {name:'生命周期 API', pageName: ''},
            {name:'应用级事件 API', pageName: ''},
            {name:'ENV API', pageName: ''}
          ]
        },
        {
          id: 'ad',
          name: '广告',
          open: false,
          pages: [
            {name:'广告 API', pageName: ''}
          ]
        },
        {
          id: 'pay',
          name: '支付',
          open: false,
          pages: [
            {name:'支付宝小程序 API', pageName: ''}
          ]
        },
        {
          id: 'canvas',
          name: '画布',
          open: false,
          pages: [
            {name:'画布 API', pageName: ''}
          ]
        },
        {
          id: 'device',
          name: '设备',
          open: false,
          pages: [
            {name:'加速计 API', pageName: ''},
            {name:'电量 API', pageName: ''},
            {name:'低功耗蓝牙 API', pageName: ''},
            {name:'蓝牙 API', pageName: ''},
            {name:'剪贴板 API', pageName: ''},
            {name:'罗盘 API', pageName: ''},
            {name:'联系人 API', pageName: ''},
            {name:'设备方向 API', pageName: ''},
            {name:'陀螺仪 API', pageName: ''},
            {name:'iBeacon API', pageName: ''},
            {name:'网络 API', pageName: ''},
            {name:'NFC API', pageName: ''},
            {name:'性能 API', pageName: ''},
            {name:'电话 API', pageName: ''},
            {name:'扫码 API', pageName: ''},
            {name:'屏幕 API', pageName: ''},
            {name:'振动 API', pageName: ''},
            {name:'Wi-Fi API', pageName: ''}
          ]
        },
        {
          id: 'ext',
          name: '第三方平台',
          pages: [
            {name:'第三方平台 API', pageName: ''}
          ]
        },
        {
          id: 'files',
          name: '文件',
          pages: [
            {name:'文件 API', pageName: ''}
          ]
        },
        {
          id: 'framework',
          name: '小程序框架',
          pages: [
            {name:'小程序框架 API', pageName: ''}
          ]
        },
        {
          id: 'location',
          name: '位置',
          pages: [
            {name:'位置 API', pageName: ''}
          ]
        },
        {
          id: 'media',
          name: '媒体',
          pages: [
            {name:'音频 API', pageName: ''},
            {name:'背景音频 API', pageName: ''},
            {name:'相机 API', pageName: ''},
            {name:'富文本 API', pageName: ''},
            {name:'图片 API', pageName: ''},
            {name:'实时音视频 API', pageName: ''},
            {name:'地图 API', pageName: ''},
            {name:'录音 API', pageName: ''},
            {name:'视频 API', pageName: ''},
            {name:'音视频合成 API', pageName: ''}
          ]
        },
        {
          id: 'network',
          name: '网络',
          pages: [
            {name:'下载 API', pageName: ''},
            {name:'mDNS API', pageName: ''},
            {name:'发起请求 API', pageName: ''},
            {name:'UDP 通信 API', pageName: ''},
            {name:'上传 API', pageName: ''},
            {name:'WebSocket API', pageName: ''}
          ]
        },
        {
          id: 'open-api',
          name: '开放接口',
          pages: [
            {name:'账号信息 API', pageName: ''},
            {name:'收货地址 API', pageName: ''},
            {name:'授权 API', pageName: ''},
            {name:'卡券 API', pageName: ''},
            {name:'数据分析 API', pageName: ''},
            {name:'发票 API', pageName: ''},
            {name:'登录 API', pageName: ''},
            {name:'小程序跳转 API', pageName: ''},
            {name:'支付 API', pageName: ''},
            {name:'数据上报 API', pageName: ''},
            {name:'设置 API', pageName: ''},
            {name:'生物认证 API', pageName: ''},
            {name:'订阅消息 API', pageName: ''},
            {name:'用户信息 API', pageName: ''},
            {name:'微信客服 API', pageName: ''},
            {name:'微信运动 API', pageName: ''}
          ]
        },
        {
          id: 'route',
          name: '路由',
          pages: [
            {name:'路由 API', pageName: ''}
          ]
        },
        {
          id: 'share',
          name: '转发',
          pages: [
            {name:'转发 API', pageName: ''}
          ]
        },
        {
          id: 'storage',
          name: '数据缓存',
          pages: [
            {name:'后台获取 API', pageName: ''},
            {name:'数据缓存 API', pageName: ''}
          ]
        },
        {
          id: 'ui',
          name: '界面',
          pages: [
            {name:'动画 API', pageName: ''},
            {name:'背景 API', pageName: ''},
            {name:'自定义组件 API', pageName: ''},
            {name:'字体 API', pageName: ''},
            {name:'键盘 API', pageName: ''},
            {name:'菜单 API', pageName: ''},
            {name:'导航栏 API', pageName: ''},
            {name:'下拉刷新 API', pageName: ''},
            {name:'滚动 API', pageName: ''},
            {name:'置顶 API', pageName: ''},
            {name:'TabBar API', pageName: ''},
            {name:'窗口 API', pageName: ''},
            {name:'交互 API', pageName: ''}
          ]
        },
        {
          id: 'worker',
          name: 'Worker',
          pages: [
            {name:'Worker API', pageName: ''}
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

    var apiPages = 0
    var noDemoApis = 0
    this.state.list.map((item)=>{
      apiPages += item.pages.length
      noDemoApis += item.pages.filter((page)=>page.pageName == '').length
    })

    return (
      <View className='index'>
        <View className='index-hd'>
          <Image className='index-logo' src={logo} />
          <View className='index-desc'>
            <Text className='index-desc_text'>Api总数为：{apiPages}，未创建Demo的Api总数为：{noDemoApis}</Text>
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
                // item._pages = item.target.map(target => {
                //   return {
                //     name: target.name,
                //     url: `/pages/component/${target.pageName}/${target.pageName}`,
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
