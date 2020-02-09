---
title: Taro.setTabBarBadge(option)
sidebar_label: setTabBarBadge
id: version-1.3.37-setTabBarBadge
original_id: setTabBarBadge
---

为 tabBar 某一项的右上角添加文本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.setTabBarBadge.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| index | `number` | 是 | tabBar 的哪一项，从左边算起 |
| text | `string` | 是 | 显示的文本，超过 4 个字符则显示成 ... |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.setTabBarBadge({
  index: 0,
  text: '1'
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setTabBarBadge | ✔️ | ✔️ |  |
