---
title: Taro.showModal(option)
sidebar_label: showModal
---

Displays the modal dialog box.

**Note**

- For Android 6.7.2 and below, when you tap **Cancel** or **Mask**, the callback will fail with the errMsg of "fail cancel".
- For Android 6.7.2 & above and iOS, tapping **Mask** will not close the modal dialog box, so avoid using the "Cancel" branch to implement the business logic.


> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/interaction/wx.showModal.html)

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
      <td>title</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Prompt title</td>
    </tr>
    <tr>
      <td>content</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Prompt content</td>
    </tr>
    <tr>
      <td>cancelColor</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The text color of the "Cancel" button, which must be a color string in hexadecimal format</td>
    </tr>
    <tr>
      <td>cancelText</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The text of the "Cancel" button, not more than 4 characters</td>
    </tr>
    <tr>
      <td>confirmColor</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The text color of the "OK" button, which must be a color string in hexadecimal format</td>
    </tr>
    <tr>
      <td>confirmText</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The text of the "OK "button, not more than 4 characters</td>
    </tr>
    <tr>
      <td>showCancel</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether to display the "Cancel" button</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: SuccessCallbackResult) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
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
      <td>cancel</td>
      <td><code>boolean</code></td>
      <td>When the value is "true", it indicates that the user tapped the "Cancel" button. (this is used for Android system to distinguish whether "Mask" or "Cancel" is tapped)</td>
    </tr>
    <tr>
      <td>confirm</td>
      <td><code>boolean</code></td>
      <td>When the value is "true", it indicates that the user tapped the "OK" button.</td>
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
Taro.showModal({
  title: 'Prompt',
  content: 'This is a modal pop-up window',
  success (res) {
    if (res.confirm) {
      console.log('"OK" is tapped')
    } else if (res.cancel) {
      console.log('"Cancel" is tapped')
    }
  }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.showModal | ✔️ | ✔️ | ✔️ |
