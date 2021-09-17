---
title: Taro.getStorageInfo(option)
sidebar_label: getStorageInfo
---

Asynchronously gets the information related to the current storage.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/storage/wx.getStorageInfo.html)

## Type

```tsx
(option?: Option) => Promise<CallbackResult>
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

### SuccessCallbackOption

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
      <td>currentSize</td>
      <td><code>number</code></td>
      <td>Current space occupied (in KB)</td>
    </tr>
    <tr>
      <td>keys</td>
      <td><code>string[]</code></td>
      <td>All keys in the current storage</td>
    </tr>
    <tr>
      <td>limitSize</td>
      <td><code>number</code></td>
      <td>Space size limit (in KB)</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.getStorageInfo({
  success: function (res) {
    console.log(res.keys)
    console.log(res.currentSize)
    console.log(res.limitSize)
  }
})
```

```tsx
try {
  const res = Taro.getStorageInfoSync()
  console.log(res.keys)
  console.log(res.currentSize)
  console.log(res.limitSize)
} catch (e) {
  // Do something when catch error
}
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getStorageInfo | ✔️ | ✔️ | ✔️ |
