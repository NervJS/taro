---
title: OfficialAccount
sidebar_label: OfficialAccount
id: version-2.1.1-official-account
original_id: official-account
---

公众号关注组件。当用户扫小程序码打开小程序时，开发者可在小程序内配置公众号关注组件，方便用户快捷关注公众号，可嵌套在原生组件内。

Tips
使用组件前，需前往小程序后台，在“设置”->“关注公众号”中设置要展示的公众号。注：设置的公众号需与小程序主体一致。

在一个小程序的生命周期内，只有从以下场景进入小程序，才具有展示引导关注公众号组件的能力:

当小程序从扫小程序码场景（场景值1047，场景值1124）打开时
当小程序从聊天顶部场景（场景值1089）中的「最近使用」内打开时，若小程序之前未被销毁，则该组件保持上一次打开小程序时的状态
当从其他小程序返回小程序（场景值1038）时，若小程序之前未被销毁，则该组件保持上一次打开小程序时的状态
为便于开发者调试，基础库 2.7.3 版本起开发版小程序增加以下场景展示公众号组件：

开发版小程序从扫二维码（场景值 1011）打开 — 体验版小程序打开
组件限定最小宽度为 300px，高度为定值 84px。

每个页面只能配置一个该组件。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/official-account.html)

## 类型

```tsx
ComponentType<OfficialAccountProps>
```

## OfficialAccountProps

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
      <td>onLoad</td>
      <td><code>BaseEventOrigFunction&lt;detail&gt;</code></td>
      <td style="text-align:center">否</td>
      <td>组件加载成功时触发</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;detail&gt;</code></td>
      <td style="text-align:center">否</td>
      <td>组件加载失败时触发</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| OfficialAccountProps.onLoad | ✔️ |  |  |
| OfficialAccountProps.onError | ✔️ |  |  |

### detail

detail 对象

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>status</td>
      <td><code>number</code></td>
      <td>状态码</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>错误信息</td>
    </tr>
  </tbody>
</table>

### status

status 有效值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>-2</td>
      <td>网络错误</td>
    </tr>
    <tr>
      <td>-1</td>
      <td>数据解析错误</td>
    </tr>
    <tr>
      <td>0</td>
      <td>加载成功</td>
    </tr>
    <tr>
      <td>1</td>
      <td>小程序关注公众号功能被封禁</td>
    </tr>
    <tr>
      <td>2</td>
      <td>关联公众号被封禁</td>
    </tr>
    <tr>
      <td>3</td>
      <td>关联关系解除或未选中关联公众号</td>
    </tr>
    <tr>
      <td>4</td>
      <td>未开启关注公众号功能</td>
    </tr>
    <tr>
      <td>5</td>
      <td>场景值错误</td>
    </tr>
    <tr>
      <td>6</td>
      <td>重复创建</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| OfficialAccount | ✔️ |  |  |
