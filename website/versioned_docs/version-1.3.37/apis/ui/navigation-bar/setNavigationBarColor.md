---
title: Taro.setNavigationBarColor(option)
sidebar_label: setNavigationBarColor
id: version-1.3.37-setNavigationBarColor
original_id: setNavigationBarColor
---

设置页面导航条颜色

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.setNavigationBarColor.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| backgroundColor | `string` | 是 | 背景颜色值，有效值为十六进制颜色 |
| frontColor | `string` | 是 | 前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000 |
| animation | `AnimationOption` | 否 | 动画效果 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### AnimationOption

动画效果

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| duration | `number` | 否 | 动画变化时间，单位 ms |
| timingFunc | `"linear" | "easeIn" | "easeOut" | "easeInOut"` | 否 | 动画变化方式<br /><br />可选值：<br />- 'linear': 动画从头到尾的速度是相同的;<br />- 'easeIn': 动画以低速开始;<br />- 'easeOut': 动画以低速结束;<br />- 'easeInOut': 动画以低速开始和结束; |

## 示例代码

```tsx
Taro.setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: '#ff0000',
    animation: {
        duration: 400,
        timingFunc: 'easeIn'
    }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setNavigationBarColor | ✔️ | ✔️ | ✔️(不支持 animation 参数) |
