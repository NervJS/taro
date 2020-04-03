---
title: Taro.setNavigationBarColor(option)
sidebar_label: setNavigationBarColor
---

设置页面导航条颜色

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.setNavigationBarColor.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
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
      <td>backgroundColor</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>背景颜色值，有效值为十六进制颜色</td>
    </tr>
    <tr>
      <td>frontColor</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000</td>
    </tr>
    <tr>
      <td>animation</td>
      <td><code>AnimationOption</code></td>
      <td style="text-align:center">否</td>
      <td>动画效果</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### AnimationOption

动画效果

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
      <td>duration</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>动画变化时间，单位 ms</td>
    </tr>
    <tr>
      <td>timingFunc</td>
      <td><code>&quot;linear&quot; | &quot;easeIn&quot; | &quot;easeOut&quot; | &quot;easeInOut&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>动画变化方式<br /><br />可选值：<br />- 'linear': 动画从头到尾的速度是相同的;<br />- 'easeIn': 动画以低速开始;<br />- 'easeOut': 动画以低速结束;<br />- 'easeInOut': 动画以低速开始和结束;</td>
    </tr>
  </tbody>
</table>

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
