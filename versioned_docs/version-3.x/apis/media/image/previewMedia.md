---
title: Taro.previewMedia(option)
sidebar_label: previewMedia
---

预览图片和视频。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.previewMedia.html)

## 类型

```tsx
(option: Option) => Promise<TaroGeneral.CallbackResult>
```

## 参数

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### Sources

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| url | `string` | 是 | 图片或视频的地址 |
| type | "image" or "video" | 否 | 资源的类型（图片或视频），默认值：image |
| poster | `string` | 否 | 视频的封面图片 |

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| sources | `Sources[]` | 是 | 需要预览的资源列表 |
| current | `number` | 否 | 当前显示的资源序号，默认值：0 |
| showmenu | `boolean` | 否 | 是否显示长按菜单	2.13.0，默认值：true |
| referrerPolicy | `string` | 否 | origin: 发送完整的referrer; no-referrer: 不发送。格式固定为 https://servicewechat.com/{appid}/{version}/page-frame.html，其中 {appid} 为小程序的 appid，{version} 为小程序的版本号，版本号为 0 表示为开发版、体验版以及审核版本，版本号为 devtools 表示为开发者工具，其余为正式版本；默认值：no-referrer |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.previewMedia({
  sources: []
})
```
