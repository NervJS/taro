---
title: Taro.setTabBarItem(option)
sidebar_label: setTabBarItem
---

Dynamically sets the content of a tabBarn item. For image content, temporary files and network files are supported as of `2.7.0`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/tab-bar/wx.setTabBarItem.html)

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
      <td>index</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Specifies which item of tabBar, starting from the left</td>
    </tr>
    <tr>
      <td>text</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The text of a button on tab</td>
    </tr>
    <tr>
      <td>iconPath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The path to the icon. The icon size is limited to 40 KB. Recommended size is 81 px * 81 px, This parameter does not take effect when postion is top.</td>
    </tr>
    <tr>
      <td>selectedIconPath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The path to the selected icon. The icon size is limited to 40 KB. Recommended size is 81 px * 81 px, This parameter does not take effect when postion is top.</td>
    </tr>
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

## Sample Code

```tsx
Taro.setTabBarItem({
  index: 0,
  text: 'text',
  iconPath: '/path/to/iconPath',
  selectedIconPath: '/path/to/selectedIconPath'
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setTabBarItem | ✔️ | ✔️ | ✔️ |
