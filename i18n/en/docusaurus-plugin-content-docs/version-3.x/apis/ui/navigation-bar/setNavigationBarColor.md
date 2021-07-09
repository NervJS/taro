---
title: Taro.setNavigationBarColor(option)
sidebar_label: setNavigationBarColor
---

Sets the color of the navigation bar in the page.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/navigation-bar/wx.setNavigationBarColor.html)

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
      <td>backgroundColor</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Background color value, whose valid value is hexadecimal color</td>
    </tr>
    <tr>
      <td>frontColor</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Foreground color values, including colors of button, title, and status bar; only #ffffff and #000000 are supported.</td>
    </tr>
    <tr>
      <td>animation</td>
      <td><code>AnimationOption</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Animation effects</td>
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

### AnimationOption

object.animation is composed as follows

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
      <td>duration</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Animation change time (in ms)</td>
    </tr>
    <tr>
      <td>timingFunc</td>
      <td><code>&quot;linear&quot; | &quot;easeIn&quot; | &quot;easeOut&quot; | &quot;easeInOut&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Animation change mode.<br /><br />Enum: <br />- 'linear': The animation keeps the same speed from start to end;<br />- 'easeIn': The animation starts at low speed;<br />- 'easeOut': The animation ends at low speed;<br />- 'easeInOut': The animation starts and ends at low speed;</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: '#ff0000',
    animation: {
        duration: 400,
        timingFunc: 'easeIn'
    }
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setNavigationBarColor | ✔️ | ✔️ | ✔️(The `animation` is not supported) |
