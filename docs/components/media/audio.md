---
title: Audio
sidebar_label: Audio
---

音频。1.6.0版本开始，该组件不再维护。建议使用能力更强的 Taro.createInnerAudioContext 接口

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/audio.html)

## 类型

```tsx
ComponentType<AudioProps>
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

## AudioProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| id | `string` |  | 是 | audio 组件的唯一标识符 |
| src | `string` |  | 是 | 要播放音频的资源地址 |
| loop | `boolean` | `false` | 是 | 是否循环播放 |
| muted | `boolean` | `false` | 否 | 是否静音播放<br />**不推荐使用** |
| controls | `boolean` | `false` | 是 | 是否显示默认控件 |
| poster | `string` |  | 是 | 默认控件上的音频封面的图片资源地址，如果 controls 属性值为 false 则设置 poster 无效 |
| name | `string` | `"未知音频"` | 是 | 默认控件上的音频名字，如果 controls 属性值为 false 则设置 name 无效 |
| author | `string` | `"未知作者"` | 是 | 默认控件上的作者名字，如果 controls 属性值为 false 则设置 author 无效 |
| onError | `BaseEventOrigFunction<onErrorEventDetail>` |  | 否 | 当发生错误时触发 error 事件，detail = {errMsg: MediaError.code} |
| onPlay | `BaseEventOrigFunction<any>` |  | 否 | 当开始/继续播放时触发play事件 |
| onPause | `BaseEventOrigFunction<any>` |  | 否 | 当暂停播放时触发 pause 事件 |
| onTimeUpdate | `BaseEventOrigFunction<onTimeUpdateEventDetail>` |  | 否 | 当播放进度改变时触发 timeupdate 事件，detail = {currentTime, duration} |
| onEnded | `BaseEventOrigFunction<any>` |  | 否 | 当播放到末尾时触发 ended 事件 |

### API 支持度

| API | 微信小程序 | 百度小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: |
| AudioProps.id | ✔️ |  |  |  |
| AudioProps.src | ✔️ | ✔️ | ✔️ |  |
| AudioProps.loop | ✔️ | ✔️ | ✔️ |  |
| AudioProps.muted |  |  | ✔️ |  |
| AudioProps.controls | ✔️ | ✔️ | ✔️ |  |
| AudioProps.poster | ✔️ | ✔️ |  |  |
| AudioProps.name | ✔️ |  |  |  |
| AudioProps.author | ✔️ |  |  |  |
| AudioProps.onError | ✔️ | ✔️ | ✔️ |  |
| AudioProps.onPlay | ✔️ | ✔️ | ✔️ |  |
| AudioProps.onPause | ✔️ | ✔️ | ✔️ |  |
| AudioProps.onTimeUpdate | ✔️ | ✔️ | ✔️ |  |
| AudioProps.onEnded | ✔️ | ✔️ | ✔️ |  |

### onErrorEventDetail

| 参数 | 类型 |
| --- | --- |
| errMsg | 1 or 2 or 3 or 4 |

### onTimeUpdateEventDetail

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| currentTime | `number` | 当前时间 |
| duration | `number` | 持续时间 |

### MediaError

#### code

| 参数 | 说明 |
| --- | --- |
| 1 | 获取资源被用户禁止 |
| 2 | 网络错误 |
| 3 | 解码错误 |
| 4 | 不合适资源 |

## API 支持度

| API | 微信小程序 | 百度小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: |
| Audio | ✔️ | ✔️ | ✔️ |  |
