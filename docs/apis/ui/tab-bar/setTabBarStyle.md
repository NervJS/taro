---
title: Taro.setTabBarStyle(option)
sidebar_label: setTabBarStyle
---

动态设置 tabBar 的整体样式

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.setTabBarStyle.html)

## 类型

```tsx
(option?: Option) => Promise<CallbackResult>
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
      <td>tab 的背景色，HexColor</td>
    </tr>
    <tr>
      <td>borderStyle</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>tabBar上边框的颜色， 仅支持 black/white</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>tab 上的文字默认颜色，HexColor</td>
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
      <td>selectedColor</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>tab 上的文字选中时的颜色，HexColor</td>
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
Taro.setTabBarStyle({
  color: '#FF0000',
  selectedColor: '#00FF00',
  backgroundColor: '#0000FF',
  borderStyle: 'white'
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setTabBarStyle | ✔️ | ✔️ |  |
