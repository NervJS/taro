---
title: Video
sidebar_label: Video
---

视频。相关api：Taro.createVideoContext

备注：h5上因为没有测试，所以暂时写了“待定”，需要`Video`来确认。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/video.html)

## 类型

```tsx
ComponentType<VideoProps>
```

## 示例代码

```tsx
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

## VideoProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| src | `string` |  | 是 | 要播放视频的资源地址 |
| duration | `number` |  | 否 | 指定视频时长 |
| controls | `boolean` | `true` | 否 | 是否显示默认播放控件（播放/暂停按钮、播放进度、时间） |
| danmuList | `any[]` |  | 否 | 弹幕列表 |
| danmuBtn | `boolean` | `false` | 否 | 是否显示弹幕按钮，只在初始化时有效，不能动态变更 |
| enableDanmu | `boolean` | `false` | 否 | 是否展示弹幕，只在初始化时有效，不能动态变更 |
| autoplay | `boolean` | `false` | 否 | 是否自动播放 |
| loop | `boolean` | `false` | 否 | 是否循环播放 |
| muted | `boolean` | `false` | 否 | 是否静音播放 |
| initialTime | `number` |  | 否 | 指定视频初始播放位置 |
| pageGesture | `boolean` | `false` | 否 | 在非全屏模式下，是否开启亮度与音量调节手势 |
| direction | `number` |  | 否 | 设置全屏时视频的方向，不指定则根据宽高比自动判断。有效值为 0（正常竖向）, 90（屏幕逆时针90度）, -90（屏幕顺时针90度） |
| showProgress | `boolean` | `true` | 否 | 若不设置，宽度大于240时才会显示 |
| showFullscreenBtn | `boolean` | `true` | 否 | 是否显示全屏按钮 |
| showPlayBtn | `boolean` | `true` | 否 | 是否显示视频底部控制栏的播放按钮 |
| showCenterPlayBtn | `boolean` | `true` | 否 | 是否显示视频中间的播放按钮 |
| enableProgressGesture | `boolean` | `true` | 否 | 是否开启控制进度的手势 |
| objectFit | "contain" or "fill" or "cover" | `"contain"` | 否 | 当视频大小与 video 容器大小不一致时，视频的表现形式 |
| poster | `string` |  | 否 | 视频封面的图片网络资源地址，如果 controls 属性值为 false 则设置 poster 无效 |
| showMuteBtn | `boolean` | `false` | 否 | 是否显示静音按钮 |
| title | `string` |  | 否 | 视频的标题，全屏时在顶部展示 |
| playBtnPosition | "bottom" or "center" | `'bottom'` | 否 | 播放按钮的位置<br />- `bottom`: controls bar 上<br />- `center`: 视频中间 |
| enablePlayGesture | `boolean` | `false` | 否 | 是否开启播放手势，即双击切换播放/暂停 |
| autoPauseIfNavigate | `boolean` | `true` | 否 | 当跳转到其它小程序页面时，是否自动暂停本页面的视频 |
| autoPauseIfOpenNative | `boolean` | `true` | 否 | 当跳转到其它微信原生页面时，是否自动暂停本页面的视频 |
| vslideGesture | `boolean` | `false` | 否 | 在非全屏模式下，是否开启亮度与音量调节手势（同 `page-gesture`） |
| vslideGestureInFullscreen | `boolean` | `true` | 否 | 在全屏模式下，是否开启亮度与音量调节手势 |
| adUnitId | `string` |  | 否 | 视频前贴广告单元ID，更多详情可参考开放能力[视频前贴广告](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/ad/video-patch-ad.html) |
| posterForCrawler | `string` |  | 否 | 用于给搜索等场景作为视频封面展示，建议使用无播放 icon 的视频封面图，只支持网络地址 |
| showCastingButton | `boolean` |  | 否 | 显示投屏按钮。只安卓且同层渲染下生效，支持 DLNA 协议 |
| onPlay | `BaseEventOrigFunction<any>` |  | 否 | 当开始/继续播放时触发 play 事件 |
| onPause | `BaseEventOrigFunction<any>` |  | 否 | 当暂停播放时触发 pause 事件 |
| onEnded | `BaseEventOrigFunction<any>` |  | 否 | 当播放到末尾时触发 ended 事件 |
| onTimeUpdate | `BaseEventOrigFunction<onTimeUpdateEventDetail>` |  | 否 | 播放进度变化时触发, 触发频率 250ms 一次<br /><br />event.detail = {currentTime, duration} |
| onFullscreenChange | `BaseEventOrigFunction<onFullscreenChangeEventDetail>` |  | 否 | 当视频进入和退出全屏是触发<br /><br />event.detail = {fullScreen, direction}，direction取为 vertical 或 horizontal |
| onWaiting | `BaseEventOrigFunction<onWaitingEventDetail>` |  | 否 | 当视频进入和退出全屏是触发<br /><br />event.detail = {fullScreen, direction}，direction 取为 vertical 或 horizontal |
| onError | `BaseEventOrigFunction<any>` |  | 否 | 视频播放出错时触发 |
| onProgress | `BaseEventOrigFunction<onProgressEventDetail>` |  | 否 | 加载进度变化时触发，只支持一段加载 |
| onLoadedMetaData | `BaseEventOrigFunction<any>` |  | 否 | 视频元数据加载完成时触发。event.detail = {width, height, duration} |

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| VideoProps.src | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
| VideoProps.duration | ✔️ | ✔️ | ✔️ |  | (待定) |  |
| VideoProps.controls | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
| VideoProps.danmuList | ✔️ | ✔️ |  |  | (待定) |  |
| VideoProps.danmuBtn | ✔️ | ✔️ |  |  | (待定) |  |
| VideoProps.enableDanmu | ✔️ | ✔️ |  |  | (待定) |  |
| VideoProps.autoplay | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
| VideoProps.loop | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
| VideoProps.muted | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
| VideoProps.initialTime | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
| VideoProps.direction | ✔️ | ✔️ | ✔️ |  | (待定) |  |
| VideoProps.showProgress | ✔️ | ✔️ |  |  | (待定) |  |
| VideoProps.showFullscreenBtn | ✔️ | ✔️ | ✔️ |  | (待定) |  |
| VideoProps.showPlayBtn | ✔️ | ✔️ | ✔️ |  | (待定) |  |
| VideoProps.showCenterPlayBtn | ✔️ | ✔️ | ✔️ |  | (待定) |  |
| VideoProps.enableProgressGesture | ✔️ | ✔️ | ✔️ |  | (待定) |  |
| VideoProps.objectFit | ✔️ | ✔️ | ✔️ |  | (待定) |  |
| VideoProps.poster | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
| VideoProps.showMuteBtn | ✔️ |  |  |  | (待定) |  |
| VideoProps.title | ✔️ |  |  |  | (待定) |  |
| VideoProps.playBtnPosition | ✔️ |  |  |  | (待定) |  |
| VideoProps.enablePlayGesture | ✔️ |  |  |  | (待定) |  |
| VideoProps.autoPauseIfNavigate | ✔️ |  |  |  | (待定) |  |
| VideoProps.autoPauseIfOpenNative | ✔️ |  |  |  | (待定) |  |
| VideoProps.vslideGesture | ✔️ | ✔️ |  |  | (待定) |  |
| VideoProps.vslideGestureInFullscreen | ✔️ |  |  |  | (待定) |  |
| VideoProps.adUnitId | ✔️ |  |  |  |  |  |
| VideoProps.posterForCrawler | ✔️ |  |  |  |  |  |
| VideoProps.showCastingButton | ✔️ |  |  |  |  |  |
| VideoProps.onPlay | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
| VideoProps.onPause | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
| VideoProps.onEnded | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
| VideoProps.onTimeUpdate | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
| VideoProps.onFullscreenChange | ✔️ | ✔️ | ✔️ |  | (待定) |  |
| VideoProps.onWaiting | ✔️ | ✔️ |  |  | (待定) |  |
| VideoProps.onError | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
| VideoProps.onProgress | ✔️ |  | ✔️ |  | (待定) |  |
| VideoProps.onLoadedMetaData | ✔️ |  |  |  |  |  |

### direction

direction 的合法值

| 参数 | 说明 |
| --- | --- |
| 0 | 正常竖向 |
| 90 | 屏幕逆时针90度 |
| -90 | 屏幕顺时针90度 |

### objectFit

objectFit 的合法值

| 参数 | 说明 |
| --- | --- |
| contain | 包含 |
| fill | 填充 |
| cover | 覆盖 |

### playBtnPosition

playBtnPosition 的合法值

| 参数 | 说明 |
| --- | --- |
| bottom | controls bar上 |
| center | 视频中间 |

### onTimeUpdateEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| currentTime | `number` | 当前时间 |
| duration | `number` | 持续时间 |

### onFullscreenChangeEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| direction | `number` | 方向 |
| fullScreen | number or boolean | 全屏 |

### onWaitingEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| direction | `number` | 方向 |
| fullScreen | number or boolean | 全屏 |

### onProgressEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| buffered | `number` | 百分比 |

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Video | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
