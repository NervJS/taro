---
title: Taro.getAccountInfoSync()
sidebar_label: getAccountInfoSync
---

Gets the information on the current account.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/open-api/account-info/wx.getAccountInfoSync.html)

## Type

```tsx
() => AccountInfo
```

## Parameters

### AccountInfo

The account information.

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>miniProgram</td>
      <td><code>MiniProgram</code></td>
      <td>The information on the Mini Program account</td>
    </tr>
    <tr>
      <td>plugin</td>
      <td><code>Plugin</code></td>
      <td>The information on the plug-in account (required only when this API is called from a plug-in)</td>
    </tr>
  </tbody>
</table>

### MiniProgram

miniProgram is composed as follows

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>appId</td>
      <td><code>string</code></td>
      <td>The appId of the Mini Program</td>
    </tr>
  </tbody>
</table>

### Plugin

plugin is composed as follows

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>appId</td>
      <td><code>string</code></td>
      <td>The AppID of the plug-in</td>
    </tr>
    <tr>
      <td>version</td>
      <td><code>string</code></td>
      <td>The version number of the plug-in</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
const accountInfo = Taro.getAccountInfoSync();

console.log(accountInfo.miniProgram.appId) // The AppID of the Mini Program
console.log(accountInfo.plugin.appId) // The AppID of the plug-in
console.log(accountInfo.plugin.version) // The plug-in's version number in the format of 'a.b.c'
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getAccountInfoSync | ✔️ |  |  |
