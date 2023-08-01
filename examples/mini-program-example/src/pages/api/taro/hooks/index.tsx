import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * Taro-hooks
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'useDidShow',
        func: null,
      },
      {
        id: 'useDidHide',
        func: null,
      },
      {
        id: 'usePullDownRefresh',
        func: null,
      },
      {
        id: 'useReachBottom',
        func: null,
      },
      {
        id: 'usePageScroll',
        func: null,
      },
      {
        id: 'useResize',
        func: null,
      },
      {
        id: 'useShareAppMessage',
        func: null,
      },
      {
        id: 'useTabltemTap',
        func: null,
      },
      {
        id: 'useAddToFavorites',
        func: null,
      },
      {
        id: 'useShareTimeline',
        func: null,
      },
      {
        id: 'useSaveExitState',
        func: null,
      },
      {
        id: 'useLaunch',
        func: null,
      },
      {
        id: 'useError',
        func: null,
      },
      {
        id: 'useUnhandledRejection',
        func: null,
      },
      {
        id: 'usePageNotFound',
        func: null,
      },
      {
        id: 'useLoad',
        func: null,
      },
      {
        id: 'useUnload',
        func: null,
      },
      {
        id: 'useReady',
        func: null,
      },
      {
        id: 'useRouter',
        func: null,
      },
      {
        id: 'useTitleClick',
        func: null,
      },
      {
        id: 'useOptionMenuClick',
        func: null,
      },
      {
        id: 'usePullIntercept',
        func: null,
      },
    ],
  }
  render() {
    return (
      <View className='api-page'>
        {this.state.list.map((item) => {
          return (
            <View key={item.id} className='api-page-btn' onClick={item.func == null ? () => {} : item.func}>
              {item.id}
              {item.func == null && <Text className='navigator-state tag'>未创建Demo</Text>}
            </View>
          )
        })}
      </View>
    )
  }
}
