---
title: Taro.showShareMenu(option)
sidebar_label: showShareMenu
id: version-2.1.1-showShareMenu
original_id: showShareMenu
---

显示当前页面的转发按钮

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.showShareMenu.html)

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
    <tr>
      <td>withShareTicket</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否使用带 shareTicket 的转发<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html">详情</a></td>
    </tr>
    <tr>
      <td>showShareItems</td>
      <td><code>string[]</code></td>
      <td style="text-align:center">否</td>
      <td>QQ小程序分享功能，支持分享到QQ、QQ空间、微信好友、微信朋友圈<br />支持的值： ['qq', 'qzone', 'wechatFriends', 'wechatMoment']<br />API 支持度: qq</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | QQ 小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: |
| Option.showShareItems |  | ✔️ |  |  |

## 示例代码

```tsx
Taro.showShareMenu({
  withShareTicket: true
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.showShareMenu | ✔️ |  |  |
