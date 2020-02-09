---
title: Taro.setTabBarItem(option)
sidebar_label: setTabBarItem
id: version-1.3.37-setTabBarItem
original_id: setTabBarItem
---

动态设置 tabBar 某一项的内容，`2.7.0` 起图片支持临时文件和网络文件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.setTabBarItem.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| index | `number` | 是 | tabBar 的哪一项，从左边算起 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| iconPath | `string` | 否 | 图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，当 postion 为 top 时，此参数无效 |
| selectedIconPath | `string` | 否 | 选中时的图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px ，当 postion 为 top 时，此参数无效 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |
| text | `string` | 否 | tab 上的按钮文字 |

## 示例代码

```tsx
Taro.setTabBarItem({
  index: 0,
  text: 'text',
  iconPath: '/path/to/iconPath',
  selectedIconPath: '/path/to/selectedIconPath'
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setTabBarItem | ✔️ | ✔️ | ✔️ |
