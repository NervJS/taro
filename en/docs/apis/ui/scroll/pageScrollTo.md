---
title: Taro.pageScrollTo(option)
sidebar_label: pageScrollTo
---

Scrolls the screen to the target location

**selector 语法** selector类似于 CSS 的选择器，但仅支持下列语法。

+ ID选择器：#the-id
+ class选择器（可以连续指定多个）：.a-class.another-class
+ 子元素选择器：.the-parent > .the-child
+ 后代选择器：.the-ancestor .the-descendant
+ 跨自定义组件的后代选择器：.the-ancestor >>> .the-descendant
+ 多选择器的并集：#a-node, .some-other-nodes

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/ui/scroll/wx.pageScrollTo.html)

## Type

```tsx
(option: Option) => void
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
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The duration of the scrolling animation (in ms)</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Scrolls the screen to the target location (in px)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>selector, css selector (rn not support)</td>
    </tr>
    <tr>
      <td>scrollTop</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>selector</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.pageScrollTo({
  scrollTop: 0,
  duration: 300
})
```

## API Support

|        API        | WeChat Mini-Program | H5 | React Native |
|:-----------------:|:-------------------:|:--:|:------------:|
| Taro.pageScrollTo |         ✔️          | ✔️ |      ✔️      |
