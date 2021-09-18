---
title: Taro.showActionSheet(option)
sidebar_label: showActionSheet
---

Displays the operation menu.

**Note**

- For Android 6.7.2 and below, when you tap **Cancel** or **Mask**, the callback will fail with the errMsg of "fail cancel".
- For Android 6.7.2 & above and iOS, tapping **Mask** will not close the modal dialog box, so avoid using the "Cancel" branch to implement the business logic.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/interaction/wx.showActionSheet.html)

## Type

```tsx
(option: Option) => Promise<SuccessCallbackResult>
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
      <td>itemList</td>
      <td><code>string[]</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The text array of the button, with a length limited to 6</td>
    </tr>
    <tr>
      <td>itemColor</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The text color of the button</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: CallbackResult) =&gt; void</code></td>
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
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
  </tbody>
</table>

### SuccessCallbackResult

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
      <td>tapIndex</td>
      <td><code>number</code></td>
      <td>The sequence number of the button tapped by the user, from top to bottom and starting from 0</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>call result</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.showActionSheet({
  itemList: ['A', 'B', 'C'],
  success: function (res) {
    console.log(res.tapIndex)
  },
  fail: function (res) {
    console.log(res.errMsg)
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.showActionSheet | ✔️ | ✔️ | ✔️ |
