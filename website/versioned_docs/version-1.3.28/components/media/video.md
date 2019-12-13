---
title: Video
sidebar_label: Video
id: version-1.3.28-video
original_id: video
---

##### 视频

> 属性及支持度

| 属性名 | 类型 | 默认值 | 说明 |
|:-:|:-:|:-:|:--|
| src            | String      |        | 要播放视频的资源地址                                         |
| controls       | Boolean     | true   | 是否显示默认播放控件（播放/暂停按钮、播放进度、时间）        |
| autoplay       | Boolean     | false  | 是否自动播放                                                 |
| poster         | String      |        | 视频封面的图片网络资源地址，如果 controls 属性值为 false 则设置 poster 无效 |
| initialTime   | Number      |        | 指定视频初始播放位置                                         |
| loop           | Boolean     | false  | 是否循环播放                                                 |
| muted          | Boolean     | false  | 是否静音播放                                                 |
| onPlay       | EventHandle |        | 当开始/继续播放时触发 play 事件                                |
| onPause      | EventHandle |        | 当暂停播放时触发 pause 事件                                  |
| onEnded      | EventHandle |        | 当播放到末尾时触发 ended 事件                                |
| onTimeUpdate | EventHandle |        | 播放进度变化时触发。触发频率 250ms 一次 |
| onError      | EventHandle |        | 视频播放出错时触发                                           |
| autoPauseIfNavigate | Boolean | true |当跳转到其它小程序页面时，是否自动暂停本页面的视频                         |
| autoPauseIfOpenNative | Boolean | true |当跳转到其它微信原生页面时，是否自动暂停本页面的视频                         |
| direction   | Number    |         | 设置全屏时视频的方向，不指定则根据宽高比自动判断                                |
| title       | String      |      | 视频的标题，全屏时在顶部展示                                                |
| danmuBtn    | Boolean     | false | 是否显示弹幕按钮，只在初始化时有效，不能动态变更                           |
| danmuList   | Array `<object>` | [] | 弹幕列表                                                              |
| duration    | Number      |       | 指定视频时长                                                           |
| enableDanmu | Boolean     | false | 是否展示弹幕，只在初始化时有效，不能动态变更                                |
| enablePlayGesture | Boolean | false | 是否开启播放手势，即双击切换播放/暂停                             |
| enableProgressGesture | Boolean | true |是否开启控制进度的手势
| objectFit | String | contain | 当视频大小与 video 容器大小不一致时，视频的表现形式                            |
| onFullscreenChange | EventHandle |  | 视频进入和退出全屏时触发，event.detail = {fullScreen, direction}，direction 有效值为 vertical 或 horizontal                         |
| onProgress | EventHandle |  | 加载进度变化时触发，只支持一段加载。event.detail = {buffered}，百分比                         |
| onWaiting | EventHandle |  | 视频出现缓冲时触发                                   |
| playBtnPosition | String | bottom | 播放按钮的位置                         |
| showCenterPlayBtn | Boolean | true | 是否显示视频中间的播放按钮                         |
| showFullscreenBtn | Boolean | true | 是否显示全屏按钮                         |
| showMuteBtn | Boolean | false | 是否显示静音按钮                         |
| showPlayBtn | Boolean | true | 是否显示视频底部控制栏的播放按钮                         |
| showProgress | Boolean | true | 若不设置，宽度大于240时才会显示                         |
| vslideGesture | Boolean | false | 在非全屏模式下，是否开启亮度与音量调节手势（同 pageGesture）                         |
| vslideGestureInFullscreen | Boolean | true |在全屏模式下，是否开启亮度与音量调节手势                         | |


> 各端支持度


| 属性名 | H5 | ReactNative | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 |
| :-: | :-: | :-: | :-: |:-: | :-: | :-: |
|  src            | ✔ | x | ✔ |✔ |✔ | ✔ |
|  controls       |  ✔ | x | ✔ |✔ |✔ | ✔ |
|  autoplay       | ✔ | x | ✔ |✔ |✔ | ✔ |
|  poster         | ✔ | x | ✔ |✔ |✔ | ✔ |
|  initialTime   | ✔ | x | ✔ |✔ |✔ | ✔ |
|  loop           | ✔ | x | ✔ |✔ |✔ | ✔ |
|  muted          | ✔ | x | ✔ |✔ |✔ | ✔ |
|  onPlay        | ✔ | x | ✔ |✔ |✔ | ✔ |
|  onPause      | ✔ | x | ✔ |✔ |✔ | ✔ |
|  onEnded       | ✔ | x | ✔ |✔ |✔ | ✔ |
|  onTimeUpdate   | ✔ | x | ✔ |✔ |✔ | ✔ |
|  onError       | ✔ | x | ✔ |✔ |✔ | ✔ |
| autoPauseIfNavigate | 待定 | x | ✔ | x | x | x |
| autoPauseIfOpenNative | 待定 | x | ✔ | x | x | x |
| direction   | 待定 | x | ✔ | ✔ | ✔ | x | x |
| title       | 待定 | x | ✔ | x | x | x |
| danmuBtn    | 待定 | x | ✔ |  ✔ | x | x |
| danmuList   | 待定 | x | ✔ | ✔ | x | x |
| duration    | 待定 | x |  ✔ | ✔ |  ✔ | x |
| enableDanmu | 待定 | x |  ✔ |  ✔ | x | x |
| enablePlayGesture | 待定 | x |  ✔ | x | x | x |
| enableProgressGesture | 待定 | x |  ✔ |  ✔ | ✔ | x |
| objectFit | 待定 | x | ✔ |  ✔ | ✔ | x |
| onFullscreenChange | 待定 | x |  ✔ |  ✔ | ✔ | x |
| onProgress | 待定 | x | ✔ | x | ✔ | x |
| onWaiting | 待定 | x |  ✔ |  ✔ | x | x |
| playBtnPosition | 待定 | x | ✔ | x | x | x |
| showCenterPlayBtn | 待定 | x |  ✔ |  ✔ | ✔ | x |
| showFullscreenBtn | 待定 | x | ✔ |  ✔ | ✔ | x |
| showMuteBtn | 待定 | x |  ✔ | x | x | x |
| showPlayBtn | 待定 | x |  ✔ |  ✔ |  ✔ | x |
| showProgress | 待定 | x | ✔ |  ✔ | x | x |
| vslideGesture | 待定 | x |  ✔ | ✔ | x | x |
| vslideGestureInFullscreen | 待定 | x | ✔ | x | x | x |

备注：h5上因为没有测试，所以暂时写了“待定”，需要`Video`来确认。

>其他相关属性请看各小程序官方文档

* [微信小程序 Video](https://developers.weixin.qq.com/miniprogram/dev/component/video.html)。
* [QQ小程序 Video](https://q.qq.com/wiki/develop/miniprogram/component/media/video.html)
* [百度小程序 Video](https://smartprogram.baidu.com/docs/develop/component/media_video/)。
* [字节跳动小程序 Video](https://developer.toutiao.com/docs/comp/video.html)
* [支付宝小程序 Video](https://opendocs.alipay.com/mini/component/video-)


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
