---
title: Taro.setTabBarStyle(option)
sidebar_label: setTabBarStyle
id: version-1.3.37-setTabBarStyle
original_id: setTabBarStyle
---

动态设置 tabBar 的整体样式

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.setTabBarStyle.html)

## 类型

```tsx
(option?: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| backgroundColor | `string` | 否 | tab 的背景色，HexColor |
| borderStyle | `string` | 否 | tabBar上边框的颜色， 仅支持 black/white |
| color | `string` | 否 | tab 上的文字默认颜色，HexColor |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| selectedColor | `string` | 否 | tab 上的文字选中时的颜色，HexColor |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.setTabBarStyle({
  color: '#FF0000',
  selectedColor: '#00FF00',
  backgroundColor: '#0000FF',
  borderStyle: 'white'
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setTabBarStyle | ✔️ | ✔️ |  |
