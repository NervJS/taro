---
title: Taro.updateShareMenu(option)
sidebar_label: updateShareMenu
id: version-2.1.1-updateShareMenu
original_id: updateShareMenu
---

更新转发属性

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.updateShareMenu.html)

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
      <td>activityId</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>动态消息的 activityId。通过 <a href="https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/updatable-message/updatableMessage.createActivityId.html">updatableMessage.createActivityId</a> 接口获取</td>
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
      <td>isUpdatableMessage</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否是动态消息，详见<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share/updatable-message.html">动态消息</a></td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
    <tr>
      <td>templateInfo</td>
      <td><code>UpdatableMessageFrontEndTemplateInfo</code></td>
      <td style="text-align:center">否</td>
      <td>动态消息的模板信息</td>
    </tr>
    <tr>
      <td>withShareTicket</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否使用带 shareTicket 的转发<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html">详情</a></td>
    </tr>
  </tbody>
</table>

### UpdatableMessageFrontEndTemplateInfo

动态消息的模板信息

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
      <td>parameterList</td>
      <td><code>UpdatableMessageFrontEndParameter[]</code></td>
      <td>参数列表</td>
    </tr>
  </tbody>
</table>

### UpdatableMessageFrontEndParameter

参数列表

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
      <td>name</td>
      <td><code>string</code></td>
      <td>参数名</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>string</code></td>
      <td>参数值</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.updateShareMenu({
  withShareTicket: true,
  success () { }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.updateShareMenu | ✔️ |  |  |
