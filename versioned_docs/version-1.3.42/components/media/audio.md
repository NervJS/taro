---
title: Audio
sidebar_label: Audio
---

##### 音频

> 属性

| 属性名 | 类型 | 默认值 | 说明 |
| :- | :- | :- | :- |
| src            | String      |        | 要播放音频的资源地址                                         |
| controls       | Boolean     | true   | 是否显示默认播放控件（播放/暂停按钮、播放进度、时间）        |
| autoplay       | Boolean     | false  | 是否自动播放                                                 |
| poster         | String      |        | 音频封面的图片网络资源地址，如果 controls 属性值为 false 则设置 poster 无效 |
| initialTime   | Number      |        | 指定音频初始播放位置                                         |
| loop           | Boolean     | false  | 是否循环播放                                                 |
| muted          | Boolean     | false  | 是否静音播放                                                 |
| onPlay       | EventHandle |        | 当开始/继续播放时触发 play 事件                                |
| onPause      | EventHandle |        | 当暂停播放时触发 pause 事件                                  |
| onEnded      | EventHandle |        | 当播放到末尾时触发 ended 事件                                |
| onTimeUpdate | EventHandle |        | 播放进度变化时触发，触发频率 250ms 一次 |
| onError      | EventHandle |        | 音频播放出错时触发                                           |

>各端支持度

| 属性 | 微信小程序 | H5 | ReactNative | 百度小程序 | 支付宝小程序 | 字节跳动小程序 |
| :-: | :-: | :-: | :- | :- | :- | :- |
| src          | ✔ | ✔ | x | ✔ |  |  |
| controls     | ✔ | ✔ | x | ✔ |  |  |
| autoplay     | ✔ | ✔ | x |  | |  |
| poster       | ✔ |  | x | ✔ | |  |
| initialTime  | ✔ |  | x |  |  |  |
| loop         | ✔ | ✔ | x | ✔ |  |  |
| muted        | ✔ | ✔ | x |  |  |  |
| onPlay       | ✔ | ✔ | x | ✔ |  |  |
| onPause      | ✔ | ✔ | x | ✔ |  |  |
| onEnded      | ✔ | ✔ | x | ✔ |  |  |
| onTimeUpdate | ✔ | ✔ | x | ✔ |  |  |
| onError      | ✔ | ✔ | x | ✔ |  |  |

###### 示例：
```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Audio } from '@tarojs/components'

export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <View className='components-page'>
        <Audio
          src='http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46'
          controls={true}
          autoplay={false}
          loop={false}
          muted={true}
          initialTime='30'
          id='video'
        />
      </View>
    )
  }
}
```
