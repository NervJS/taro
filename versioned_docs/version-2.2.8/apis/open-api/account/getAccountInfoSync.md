---
title: Taro.getAccountInfoSync()
sidebar_label: getAccountInfoSync
---

获取当前帐号信息

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/account-info/wx.getAccountInfoSync.html)

## 类型

```tsx
() => AccountInfo
```

## 参数

### AccountInfo

帐号信息

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
      <td>miniProgram</td>
      <td><code>MiniProgram</code></td>
      <td>小程序帐号信息</td>
    </tr>
    <tr>
      <td>plugin</td>
      <td><code>Plugin</code></td>
      <td>插件帐号信息（仅在插件中调用时包含这一项）</td>
    </tr>
  </tbody>
</table>

### MiniProgram

小程序帐号信息

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
      <td>小程序 appId</td>
    </tr>
  </tbody>
</table>

### Plugin

插件帐号信息（仅在插件中调用时包含这一项）

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
      <td>插件 appId</td>
    </tr>
    <tr>
      <td>version</td>
      <td><code>string</code></td>
      <td>插件版本号</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
const accountInfo = Taro.getAccountInfoSync();

console.log(accountInfo.miniProgram.appId) // 小程序 appId
console.log(accountInfo.plugin.appId) // 插件 appId
console.log(accountInfo.plugin.version) // 插件版本号， 'a.b.c' 这样的形式
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getAccountInfoSync | ✔️ |  |  |
