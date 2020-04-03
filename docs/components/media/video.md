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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">默认值</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>src</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>要播放视频的资源地址</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>指定视频时长</td>
    </tr>
    <tr>
      <td>controls</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>true</code></td>
      <td style="text-align:center">否</td>
      <td>是否显示默认播放控件（播放/暂停按钮、播放进度、时间）</td>
    </tr>
    <tr>
      <td>danmuList</td>
      <td><code>any[]</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>弹幕列表</td>
    </tr>
    <tr>
      <td>danmuBtn</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否显示弹幕按钮，只在初始化时有效，不能动态变更</td>
    </tr>
    <tr>
      <td>enableDanmu</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否展示弹幕，只在初始化时有效，不能动态变更</td>
    </tr>
    <tr>
      <td>autoplay</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否自动播放</td>
    </tr>
    <tr>
      <td>loop</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否循环播放</td>
    </tr>
    <tr>
      <td>muted</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否静音播放</td>
    </tr>
    <tr>
      <td>initialTime</td>
      <td><code>number</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>指定视频初始播放位置</td>
    </tr>
    <tr>
      <td>pageGesture</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>在非全屏模式下，是否开启亮度与音量调节手势</td>
    </tr>
    <tr>
      <td>direction</td>
      <td><code>number</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>设置全屏时视频的方向，不指定则根据宽高比自动判断。有效值为 0（正常竖向）, 90（屏幕逆时针90度）, -90（屏幕顺时针90度）</td>
    </tr>
    <tr>
      <td>showProgress</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>true</code></td>
      <td style="text-align:center">否</td>
      <td>若不设置，宽度大于240时才会显示</td>
    </tr>
    <tr>
      <td>showFullscreenBtn</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>true</code></td>
      <td style="text-align:center">否</td>
      <td>是否显示全屏按钮</td>
    </tr>
    <tr>
      <td>showPlayBtn</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>true</code></td>
      <td style="text-align:center">否</td>
      <td>是否显示视频底部控制栏的播放按钮</td>
    </tr>
    <tr>
      <td>showCenterPlayBtn</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>true</code></td>
      <td style="text-align:center">否</td>
      <td>是否显示视频中间的播放按钮</td>
    </tr>
    <tr>
      <td>enableProgressGesture</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>true</code></td>
      <td style="text-align:center">否</td>
      <td>是否开启控制进度的手势</td>
    </tr>
    <tr>
      <td>objectFit</td>
      <td><code>&quot;contain&quot; | &quot;fill&quot; | &quot;cover&quot;</code></td>
      <td style="text-align:center"><code>&quot;contain&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>当视频大小与 video 容器大小不一致时，视频的表现形式</td>
    </tr>
    <tr>
      <td>poster</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>视频封面的图片网络资源地址，如果 controls 属性值为 false 则设置 poster 无效</td>
    </tr>
    <tr>
      <td>showMuteBtn</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否显示静音按钮</td>
    </tr>
    <tr>
      <td>title</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>视频的标题，全屏时在顶部展示</td>
    </tr>
    <tr>
      <td>playBtnPosition</td>
      <td><code>&quot;bottom&quot; | &quot;center&quot;</code></td>
      <td style="text-align:center"><code>'bottom'</code></td>
      <td style="text-align:center">否</td>
      <td>播放按钮的位置<br />- <code>bottom</code>: controls bar 上<br />- <code>center</code>: 视频中间</td>
    </tr>
    <tr>
      <td>enablePlayGesture</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否开启播放手势，即双击切换播放/暂停</td>
    </tr>
    <tr>
      <td>autoPauseIfNavigate</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>true</code></td>
      <td style="text-align:center">否</td>
      <td>当跳转到其它小程序页面时，是否自动暂停本页面的视频</td>
    </tr>
    <tr>
      <td>autoPauseIfOpenNative</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>true</code></td>
      <td style="text-align:center">否</td>
      <td>当跳转到其它微信原生页面时，是否自动暂停本页面的视频</td>
    </tr>
    <tr>
      <td>vslideGesture</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>在非全屏模式下，是否开启亮度与音量调节手势（同 <code>page-gesture</code>）</td>
    </tr>
    <tr>
      <td>vslideGestureInFullscreen</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>true</code></td>
      <td style="text-align:center">否</td>
      <td>在全屏模式下，是否开启亮度与音量调节手势</td>
    </tr>
    <tr>
      <td>adUnitId</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>视频前贴广告单元ID，更多详情可参考开放能力<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/ad/video-patch-ad.html">视频前贴广告</a></td>
    </tr>
    <tr>
      <td>posterForCrawler</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>用于给搜索等场景作为视频封面展示，建议使用无播放 icon 的视频封面图，只支持网络地址</td>
    </tr>
    <tr>
      <td>showCastingButton</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>显示投屏按钮。只安卓且同层渲染下生效，支持 DLNA 协议</td>
    </tr>
    <tr>
      <td>onPlay</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当开始/继续播放时触发 play 事件</td>
    </tr>
    <tr>
      <td>onPause</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当暂停播放时触发 pause 事件</td>
    </tr>
    <tr>
      <td>onEnded</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当播放到末尾时触发 ended 事件</td>
    </tr>
    <tr>
      <td>onTimeUpdate</td>
      <td><code>BaseEventOrigFunction&lt;onTimeUpdateEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>播放进度变化时触发, 触发频率 250ms 一次<br /><br />event.detail = {currentTime, duration}</td>
    </tr>
    <tr>
      <td>onFullscreenChange</td>
      <td><code>BaseEventOrigFunction&lt;onFullscreenChangeEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当视频进入和退出全屏是触发<br /><br />event.detail = {fullScreen, direction}，direction取为 vertical 或 horizontal</td>
    </tr>
    <tr>
      <td>onWaiting</td>
      <td><code>BaseEventOrigFunction&lt;onWaitingEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当视频进入和退出全屏是触发<br /><br />event.detail = {fullScreen, direction}，direction 取为 vertical 或 horizontal</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>视频播放出错时触发</td>
    </tr>
    <tr>
      <td>onProgress</td>
      <td><code>BaseEventOrigFunction&lt;onProgressEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>加载进度变化时触发，只支持一段加载</td>
    </tr>
    <tr>
      <td>onLoadedMetaData</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>视频元数据加载完成时触发。event.detail = {width, height, duration}</td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>正常竖向</td>
    </tr>
    <tr>
      <td>90</td>
      <td>屏幕逆时针90度</td>
    </tr>
    <tr>
      <td>-90</td>
      <td>屏幕顺时针90度</td>
    </tr>
  </tbody>
</table>

### objectFit

objectFit 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>contain</td>
      <td>包含</td>
    </tr>
    <tr>
      <td>fill</td>
      <td>填充</td>
    </tr>
    <tr>
      <td>cover</td>
      <td>覆盖</td>
    </tr>
  </tbody>
</table>

### playBtnPosition

playBtnPosition 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>bottom</td>
      <td>controls bar上</td>
    </tr>
    <tr>
      <td>center</td>
      <td>视频中间</td>
    </tr>
  </tbody>
</table>

### onTimeUpdateEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>currentTime</td>
      <td><code>number</code></td>
      <td>当前时间</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td>持续时间</td>
    </tr>
  </tbody>
</table>

### onFullscreenChangeEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>direction</td>
      <td><code>number</code></td>
      <td>方向</td>
    </tr>
    <tr>
      <td>fullScreen</td>
      <td><code>number | boolean</code></td>
      <td>全屏</td>
    </tr>
  </tbody>
</table>

### onWaitingEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>direction</td>
      <td><code>number</code></td>
      <td>方向</td>
    </tr>
    <tr>
      <td>fullScreen</td>
      <td><code>number | boolean</code></td>
      <td>全屏</td>
    </tr>
  </tbody>
</table>

### onProgressEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>buffered</td>
      <td><code>number</code></td>
      <td>百分比</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Video | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
