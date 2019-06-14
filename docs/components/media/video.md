---
title: Video
sidebar_label: Video
---

##### 视频。

> 属性及支持度

| H5 | ReactNative| 属性名 | 类型 | 默认值 | 说明 |
| :-: | :-: | :- | :- | :- | :- |
| ✔ | x | src            | String      |        | 要播放视频的资源地址                                         |
| ✔ | x | controls       | Boolean     | true   | 是否显示默认播放控件（播放/暂停按钮、播放进度、时间）        |
| ✔ | x | autoplay       | Boolean     | false  | 是否自动播放                                                 |
| ✔ | x | poster         | String      |        | 视频封面的图片网络资源地址，如果 controls 属性值为 false 则设置 poster 无效 |
|   | x | initialTime   | Number      |        | 指定视频初始播放位置                                         |
| ✔ | x | loop           | Boolean     | false  | 是否循环播放                                                 |
| ✔ | x | muted          | Boolean     | false  | 是否静音播放                                                 |
| ✔ | x | onPlay       | EventHandle |        | 当开始/继续播放时触发 play 事件                                |
| ✔ | x | onPause      | EventHandle |        | 当暂停播放时触发 pause 事件                                  |
| ✔ | x | onEnded      | EventHandle |        | 当播放到末尾时触发 ended 事件                                |
| ✔ | x | onTimeUpdate | EventHandle |        | 播放进度变化时触发。触发频率 250ms 一次 |
| ✔ | x | onError      | EventHandle |        | 视频播放出错时触发                                           |


>其他相关属性请看各小程序官方文档

[微信小程序 Video](https://developers.weixin.qq.com/miniprogram/dev/component/video.html)。

[百度小程序 Video](https://smartprogram.baidu.com/docs/develop/component/media/#video)。

[字节跳动小程序 Video](https://developer.toutiao.com/docs/comp/video.html)。


###### 示例：
```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Video } from '@tarojs/components'

export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <View className='components-page'>
        <Video
          src='http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
          controls={true}
          autoplay={false}
          poster='http://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg'
          initialTime='0'
          id='video'
          loop={false}
          muted={false}
        />
      </View>
    )
  }
}
```
