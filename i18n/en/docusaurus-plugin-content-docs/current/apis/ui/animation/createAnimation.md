---
title: Taro.createAnimation(option)
sidebar_label: createAnimation
---

Create an `animation` instance animation. Describe the `animation` by calling the instance. Use the method of exporting the `animation` instance to export the `animation` data and pass it to the `animation` property of the component.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/wx.createAnimation.html)

## Type

```tsx
(option: Option) => Animation
```

## Parameters

### Option

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>delay</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Animation delay time (in ms)</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Animation duration (in ms)</td>
    </tr>
    <tr>
      <td>timingFunction</td>
      <td><code>&quot;linear&quot; | &quot;ease&quot; | &quot;ease-in&quot; | &quot;ease-in-out&quot; | &quot;ease-out&quot; | &quot;step-start&quot; | &quot;step-end&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Animation effect</td>
    </tr>
    <tr>
      <td>transformOrigin</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td></td>
    </tr>
  </tbody>
</table>

### timingFunction

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>linear</td>
      <td>The animation keeps the same speed from start to end</td>
    </tr>
    <tr>
      <td>ease</td>
      <td>The animation starts slow, then speeds up, and then slows down before ending.</td>
    </tr>
    <tr>
      <td>ease-in</td>
      <td>The animation starts at low speed</td>
    </tr>
    <tr>
      <td>ease-in-out</td>
      <td>The animation starts and ends at low speed</td>
    </tr>
    <tr>
      <td>ease-out</td>
      <td>The animation ends at low speed</td>
    </tr>
    <tr>
      <td>step-start</td>
      <td>The first frame of the animation jumps to the end state until the animation ends</td>
    </tr>
    <tr>
      <td>step-end</td>
      <td>The animation remains the start state until the final frame jumps to the end state</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
var animation = Taro.createAnimation({
  transformOrigin: "50% 50%",
  duration: 1000,
  timingFunction: "ease",
  delay: 0
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createAnimation | ✔️ | ✔️ |  |
