---
title: Taro.updateShareMenu(option)
sidebar_label: updateShareMenu
---

Updates the forwarding properties.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/share/wx.updateShareMenu.html)

## Type

```tsx
(option: Option) => Promise<CallbackResult>
```

## Parameters

### Option

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>activityId</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The activityId of an updatable message, which is obtained via <a href="https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/updatable-message/updatableMessage.createActivityId.html">updatableMessage.createActivityId</a> API</td>
    </tr>
    <tr>
      <td>isUpdatableMessage</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether it is an updatable message. For details, see<a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/share/updatable-message.html">Updatable Message</a></td>
    </tr>
    <tr>
      <td>templateInfo</td>
      <td><code>UpdatableMessageFrontEndTemplateInfo</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Template information for updatable messages</td>
    </tr>
    <tr>
      <td>withShareTicket</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether to forward with shareTicket.<a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/share.html">Detail</a></td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### UpdatableMessageFrontEndTemplateInfo

object.templateInfo is composed as follows

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
      <td>parameterList</td>
      <td><code>UpdatableMessageFrontEndParameter[]</code></td>
      <td>Parameter list</td>
    </tr>
  </tbody>
</table>

### UpdatableMessageFrontEndParameter

Parameter list

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
      <td>name</td>
      <td><code>string</code></td>
      <td>Parameter name</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>string</code></td>
      <td>Parameter value</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.updateShareMenu({
  withShareTicket: true,
  success () { }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.updateShareMenu | ✔️ |  |  |
