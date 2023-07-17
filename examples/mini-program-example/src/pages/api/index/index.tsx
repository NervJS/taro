import Taro from '@tarojs/taro';
import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import interfacePng from '../../../assets/api/press.png';
import basicsPng from '../../../assets/api/iphone.png';
import cachePng from '../../../assets/api/cloud-storage.png';
import networkPng from '../../../assets/api/loading.png';
import mediaPng from '../../../assets/api/play-two.png';
import locationPng from '../../../assets/api/local.png';
import canvasPng from '../../../assets/api/painted-screen.png';
import openAPISPng from '../../../assets/api/api.png';
import devicePng from '../../../assets/api/devices.png';
import TabBarApis from '../tabBarApis/tabBarApis';
import NavigationBarApis from '../navigationBarApis/navigationBarApis';

import './index.scss';

const PNGS = {
  interfacePng,
  basicsPng,
  cachePng,
  networkPng,
  mediaPng,
  locationPng,
  canvasPng,
  devicePng,
  openAPISPng,
};
export default class Index extends React.Component {
  constructor(props: never) {
    super(props)
    this.state = {
      list: [
        {
          id: 'framework',
          name: '框架',
          open: false,
          pages: [],
          target:[], 
        },
        {
          id: 'basics',
          name: '基础',
          open: false,
          pages: [],
          target:[
            'basics',
            'system',
            'update',
            'miniProgram',
            'debug',
            'performance',
            'encryption',
          ], 
        },
        {
          id: 'routing',
          name: '路由',
          open: false,
          pages: [],
          target:[], 
        },
        {
          id: 'redirection',
          name: '跳转',
          open: false,
          pages: [],
          target:[], 
        },
        {
          id: 'forward',
          name: '转发',
          open: false,
          pages: [],
          target:[], 
        },
        {
          id: 'interface',
          name: '界面',
          open: false,
          pages: [],
          target:[
            'interaction',
            'navigationBar',
            'background',
            'tabBar',
            'font',
            'pullDownRefresh',
            'scroll',
            'animation',
            'setTop',
            'customizedComponents',
            'menu',
            'windows',
          ], 
        },
        {
          id: 'network',
          name: '网络',
          open: false,
          pages: [],
          target:[
            'request',
            'download',
            'upload',
            'webSocket',
            'mDNS',
            'TCPCommunications',
            'UDPCommunications',
          ],
        },
        {
          id: 'payment',
          name: '支付',
          open: false,
          pages: [],
          target: [],
        },
        {
          id: 'cache',
          name: '数据缓存',
          open: false,
          pages: [],
          target:[], 
        },
        {
          id: 'analysis',
          name: '数据分析',
          open: false,
          pages: [],
          target:[], 
        },
        {
          id: 'canvas',
          name: '画布',
          open: false,
          pages: [],
          target:[], 
        },
        {
          id: 'media',
          name: '媒体',
          open: false,
          pages: [],
          target:[
            'map',
            'image',
            'video',
            'audio',
            'backgroundAudio',
            'realtimeAudioAndVideo',
            'recording',
            'camera',
            'richText',
            'audioOrVideoCompose',
            'realtimeVoice',
            'screenRecorder',
            'videoDecoder',
          ], 
        },
        {
          id: 'location',
          name: '位置',
          open: false,
          pages: [],
          target:[], 
        },
        {
          id: 'file',
          name: '文件',
          open: false,
          pages: [],
          target:[], 
        },
        {
          id: 'openAPIS',
          name: '开放接口',
          open: false,
          pages: [],
          target:[
            'login',
            'accountInfomation',
            'userInfomation',
            'authorization',
            'setting',
            'recipientAddress',
            'cardsAndOffers',
            'invoice',
            'biometricAuthorization',
            'weRun',
            'subscribeNews',
            'wechatRedRacket',
            'collection',
            'mineMiniProgram',
            'licensePlate',
            'wechatVideoChannel',
            'deviceVoip',
            'wechatGroup',
            'wechatCustomerService',
          ], 
        },
        {
          id: 'device',
          name: '设备',
          open: false,
          pages: [],
          target:[
            'bluetoothGeneral',
            'bluetoothLowCenter',
            'bluetoothLowPerpherals',
            'bluetoothBeacon',
            'nfc',
            'wifi',
            'calendar',
            'contact',
            'accessibility',
            'bettery',
            'clipBoard',
            'network',
            'screen',
            'keyboard',
            'phoneCall',
            'accelerometer',
            'compass',
            'deviceOrientation',
            'gyroscope',
            'memory',
            'scan',
            'sms',
            'vibration',
          ], 
        },
        {
          id: 'ai',
          name: 'AI',
          open: false,
          pages: [],
          target:[
            'inference',
            'visionAlgorithms',
            'faceRecognition',
          ], 
        },
        {
          id: 'worker',
          name: 'Worker',
          open: false,
          pages: [],
          target:[], 
        },
        {
          id: 'wxml',
          name: 'WXML',
          open: false,
          pages: [],
          target:[], 
        },
        {
          id: 'thirdParty',
          name: '第三方平台',
          open: false,
          pages: [],
          target:[], 
        },
        {
          id: 'advertising',
          name: '广告',
          open: false,
          pages: [],
          target:[], 
        },
        {
          id: 'cloudServices',
          name: '云开发',
          open: false,
          pages: [],
          target:[], 
        },
        {
          id: 'alipay',
          name: 'Alipay',
          open: false,
          pages: [],
          target:[], 
        },
        {
          id: 'qq',
          name: 'QQ',
          open: false,
          pages: [],
          target:[], 
        },
        {
          id: 'swan',
          name: 'Swan',
          open: false,
          pages: [],
          target:[], 
        },
        {
          id: 'taro',
          name: 'Taro',
          open: false,
          pages: [],
          target:[
            'expand',
            'hooks',
          ], 
        },
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

  goToComponent = (page: { url: string }) => {
    Taro.navigateTo({
      url: page.url
    });
  };

  render() {
    const { list = [] } = this.state;
    return (
      <View className='index'>
        <View className='index-hd'>
          <View className='index-desc'>
            <Text className='index-desc_text'>
              以下将展示 Taro 官方接口能力。
            </Text>
          </View>
        </View>
        <View className='index-bd'>
          <View className='kind-list'>
            {list.map(item => {
              item.hdClass =
                'kind-list-item-hd ' +
                (item.open ? 'kind-list-item-hd-show' : '');
              item.bdClass =
                'kind-list-item-bd ' +
                (item.open ? 'kind-list-item-bd-show' : '');
              item.boxClass =
                'navigator-box ' + (item.open ? 'navigator-box-show' : '');
              item.imgSrc = !!PNGS[`${item.id}Png`] ? PNGS[`${item.id}Png`] : '';
              if (item.target.length != 0) {
                item._pages = item.target.map(targetPage => {
                  return {
                    page: targetPage,
                    url: `/pages/api/${item.id}/${targetPage}/index`,
                    state: item.pages.includes(targetPage) ? 'done':'undo'
                  };
                });
              } else {
                item.url =  `/pages/api/${item.id}/index`;
                item._pages = [];
              }
              return item;
            }).map((item, index) => {
              return (
                <View className='kind-list-item' key={index}>
                  <View
                    id={item.id}
                    className={item.hdClass}
                    onClick={item.target.length == 0 ? this.goToComponent.bind(this, item) : this.kindToggle}
                  >
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
                        );
                      })}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        {/* <TabBarApis />
        <NavigationBarApis /> */}
      </View>
    )
  }
}
