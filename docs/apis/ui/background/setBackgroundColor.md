---
title: Taro.setBackgroundColor(option)
sidebar_label: setBackgroundColor
---

动态设置窗口的背景色

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/background/wx.setBackgroundColor.html)

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
      <td style="text-align:center">否</td>
      <td>窗口的背景色，必须为十六进制颜色值</td>
    </tr>
    <tr>
      <td>backgroundColorBottom</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>底部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持</td>
    </tr>
    <tr>
      <td>backgroundColorTop</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>顶部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持</td>
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

## 示例代码

```tsx
Taro.setBackgroundColor({
  backgroundColor: '#ffffff', // 窗口的背景色为白色
})
Taro.setBackgroundColor({
  backgroundColorTop: '#ffffff', // 顶部窗口的背景色为白色
  backgroundColorBottom: '#ffffff', // 底部窗口的背景色为白色
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setBackgroundColor | ✔️ |  |  |
