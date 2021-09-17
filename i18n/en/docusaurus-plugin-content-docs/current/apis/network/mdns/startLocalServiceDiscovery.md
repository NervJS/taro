---
title: Taro.startLocalServiceDiscovery(option)
sidebar_label: startLocalServiceDiscovery
---

Starts searching for the mDNS service in the LAN. The search results will be returned via the wx.onLocalService* event.

**Note**

1. wx.startLocalServiceDiscovery is a performance-consuming behavior that automatically stops after 30 seconds and executes the callback function registered with wx.onLocalServiceDiscoveryStop.

2. After calling wx.startLocalServiceDiscovery, you cannot call this API again until the search behavior stops. The operations to stop this search behavior include calling wx.stopLocalServiceDiscovery and stopping the search automatically after 30 seconds.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/network/mdns/wx.startLocalServiceDiscovery.html)

## Type

```tsx
(option: Option) => void
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
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

### FailCallbackResult

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
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Error message<br /><br />Valid values: <br />- 'invalid param': serviceType is empty;<br />- 'scan task already exist': Calls startLocalServiceDiscovery again when the current search initiated by startLocalServiceDiscovery is not stopped;</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.startLocalServiceDiscovery | ✔️ |  |  |
