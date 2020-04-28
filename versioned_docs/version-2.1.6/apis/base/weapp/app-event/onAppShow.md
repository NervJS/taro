---
title: Taro.onAppShow(callback)
sidebar_label: onAppShow
---

监听小程序切前台事件。该事件与 [`App.onShow`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/App.html#onshowobject-object) 的回调参数一致。

**返回有效 referrerInfo 的场景**

| 场景值 | 场景                            | appId含义  |
| ------ | ------------------------------- | ---------- |
| 1020   | 公众号 profile 页相关小程序列表 | 来源公众号 |
| 1035   | 公众号自定义菜单                | 来源公众号 |
| 1036   | App 分享消息卡片                | 来源App    |
| 1037   | 小程序打开小程序                | 来源小程序 |
| 1038   | 从另一个小程序返回              | 来源小程序 |
| 1043   | 公众号模板消息                  | 来源公众号 |

**注意**

部分版本在无`referrerInfo`的时候会返回 `undefined`，建议使用 `options.referrerInfo && options.referrerInfo.appId` 进行判断。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onAppShow.html)

## 类型

```tsx
(callback: (result: CallbackResult) => void) => void
```

## 参数

### CallbackResult

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
      <td>path</td>
      <td><code>string</code></td>
      <td>小程序切前台的路径</td>
    </tr>
    <tr>
      <td>query</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>小程序切前台的 query 参数</td>
    </tr>
    <tr>
      <td>referrerInfo</td>
      <td><code>ResultReferrerInfo</code></td>
      <td>来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 <code>{}</code>。(参见后文注意)</td>
    </tr>
    <tr>
      <td>scene</td>
      <td><code>number</code></td>
      <td>小程序切前台的<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html">场景值</a></td>
    </tr>
    <tr>
      <td>shareTicket</td>
      <td><code>string</code></td>
      <td>shareTicket，详见<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html">获取更多转发信息</a></td>
    </tr>
  </tbody>
</table>

### ResultReferrerInfo

来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 `{}`。(参见后文注意)

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
      <td>appId</td>
      <td><code>string</code></td>
      <td>来源小程序、公众号或 App 的 appId</td>
    </tr>
    <tr>
      <td>extraData</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>来源小程序传过来的数据，scene=1037或1038时支持</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onAppShow | ✔️ |  |  |
