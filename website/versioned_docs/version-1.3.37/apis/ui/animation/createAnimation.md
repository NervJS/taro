---
title: Taro.createAnimation(option)
sidebar_label: createAnimation
id: version-1.3.37-createAnimation
original_id: createAnimation
---

创建一个动画实例 animation。调用实例的方法来描述动画。最后通过动画实例的 export 方法导出动画数据传递给组件的 animation 属性。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/wx.createAnimation.html)

## 类型

```tsx
(option: Option) => Animation
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| delay | `number` | 否 | 动画延迟时间，单位 ms |
| duration | `number` | 否 | 动画持续时间，单位 ms |
| timingFunction | `"linear" | "ease" | "ease-in" | "ease-in-out" | "ease-out" | "step-start" | "step-end"` | 否 | 动画的效果 |
| transformOrigin | `string` | 否 |  |

### timingFunction

| 参数 | 说明 |
| --- | --- |
| linear | 动画从头到尾的速度是相同的 |
| ease | 动画以低速开始，然后加快，在结束前变慢 |
| ease-in | 动画以低速开始 |
| ease-in-out | 动画以低速开始和结束 |
| ease-out | 动画以低速结束 |
| step-start | 动画第一帧就跳至结束状态直到结束 |
| step-end | 动画一直保持开始状态，最后一帧跳到结束状态 |

## 示例代码

```tsx
var animation = Taro.createAnimation({
  transformOrigin: "50% 50%",
  duration: 1000,
  timingFunction: "ease",
  delay: 0
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createAnimation | ✔️ | ✔️ |  |
