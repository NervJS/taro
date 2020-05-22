---
title: Taro.pageScrollTo(option)
sidebar_label: pageScrollTo
---

将页面滚动到目标位置，支持选择器和滚动距离两种方式定位

**selector 语法**
selector类似于 CSS 的选择器，但仅支持下列语法。

+ ID选择器：#the-id
+ class选择器（可以连续指定多个）：.a-class.another-class
+ 子元素选择器：.the-parent > .the-child
+ 后代选择器：.the-ancestor .the-descendant
+ 跨自定义组件的后代选择器：.the-ancestor >>> .the-descendant
+ 多选择器的并集：#a-node, .some-other-nodes

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/scroll/wx.pageScrollTo.html)

## 类型

```tsx
(option: Option) => void
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
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>滚动动画的时长，单位 ms</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>scrollTop</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>滚动到页面的目标位置，单位 px</td>
    </tr>
    <tr>
      <td>selector</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>选择器, css selector</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.pageScrollTo({
  scrollTop: 0,
  duration: 300
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.pageScrollTo | ✔️ | ✔️ |  |
