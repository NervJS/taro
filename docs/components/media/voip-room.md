---
title: VoipRoom
sidebar_label: VoipRoom
---

多人音视频对话

需用户授权 `scope.camera`、`scope.record`。相关接口： [Taro.joinVoIPChat](https://developers.weixin.qq.com/miniprogram/dev/api/media/voip/wx.joinVoIPChat.html)
开通该组件权限后，开发者可在 joinVoIPChat 成功后，获取房间成员的 openid，传递给 voip-room 组件，以显示成员画面。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/voip-room.html)

## 类型

```tsx
ComponentType<VoipRoomProps>
```

## 示例代码

```tsx
export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <VoipRoom
        openId="{{item}}"
        mode="{{selfOpenId === item ? 'camera' : 'video'}}">
      </VoipRoom>
    )
  }
}
```

## VoipRoomProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| openId | `string` | `none` | 否 | 进入房间用户的 openid |
| mode | `keyof mode` | `camera` | 否 | 对话窗口类型，自身传入 camera，其它用户传入 video |
| devicePosition | `keyof devicePosition` | `front` | 否 | 仅在 mode 为 camera 时有效，前置或后置，值为front, back |
| onError | `CommonEventFunction` |  | 否 | 创建对话窗口失败时触发 |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| VoipRoomProps.openId | ✔️ |  |  |
| VoipRoomProps.mode | ✔️ |  |  |
| VoipRoomProps.devicePosition | ✔️ |  |  |
| VoipRoomProps.onError | ✔️ |  |  |

### mode

对话窗口类型

### devicePosition

摄像头类型
