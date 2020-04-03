---
title: Taro.createAnimation(option)
sidebar_label: createAnimation
---

创建一个动画实例 animation。调用实例的方法来描述动画。最后通过动画实例的 export 方法导出动画数据传递给组件的 animation 属性。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/wx.createAnimation.html)

## 类型

```tsx
(option: Option) => Animation
```

## 参数

### Option

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>delay</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>动画延迟时间，单位 ms</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>动画持续时间，单位 ms</td>
    </tr>
    <tr>
      <td>timingFunction</td>
      <td><code>&quot;linear&quot; | &quot;ease&quot; | &quot;ease-in&quot; | &quot;ease-in-out&quot; | &quot;ease-out&quot; | &quot;step-start&quot; | &quot;step-end&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>动画的效果</td>
    </tr>
    <tr>
      <td>transformOrigin</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td></td>
    </tr>
  </tbody>
</table>

### timingFunction

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>linear</td>
      <td>动画从头到尾的速度是相同的</td>
    </tr>
    <tr>
      <td>ease</td>
      <td>动画以低速开始，然后加快，在结束前变慢</td>
    </tr>
    <tr>
      <td>ease-in</td>
      <td>动画以低速开始</td>
    </tr>
    <tr>
      <td>ease-in-out</td>
      <td>动画以低速开始和结束</td>
    </tr>
    <tr>
      <td>ease-out</td>
      <td>动画以低速结束</td>
    </tr>
    <tr>
      <td>step-start</td>
      <td>动画第一帧就跳至结束状态直到结束</td>
    </tr>
    <tr>
      <td>step-end</td>
      <td>动画一直保持开始状态，最后一帧跳到结束状态</td>
    </tr>
  </tbody>
</table>

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
