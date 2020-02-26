---
title: Taro.navigateTo(option)
sidebar_label: navigateTo
---

保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 Taro.navigateBack 可以返回到原页面。小程序中页面栈最多十层。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| url | `string` | 是 | 需要跳转的应用内非 tabBar 的页面的路径, 路径后可以带参数。参数与路径之间使用 `?` 分隔，参数键与参数值用 `=` 相连，不同参数用 `&` 分隔；如 'path?key=value&key2=value2' |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| events | `Record<string, any>` | 否 | 页面间通信接口，用于监听被打开页面发送到当前页面的数据。 |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.navigateTo({
  url: 'test?id=1',
  events: {
    // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
    acceptDataFromOpenedPage: function(data) {
      console.log(data)
    },
    someEvent: function(data) {
      console.log(data)
    }
    ...
  },
  success: function (res) {
    // 通过eventChannel向被打开页面传送数据
    res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.navigateTo | ✔️ | ✔️ | ✔️ |
