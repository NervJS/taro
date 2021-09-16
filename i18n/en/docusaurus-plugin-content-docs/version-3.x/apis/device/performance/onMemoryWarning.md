---
title: Taro.onMemoryWarning(callback)
sidebar_label: onMemoryWarning
---

Listens on the insufficient memory alarm event.

This event is triggered when iOS/Android sends an insufficient memory alarm to the Mini Program process. Triggering this event does not mean that the Mini Program will be terminated. In most cases, it is only an alarm. Developers can reclaim some unnecessary resources after receiving the alarm to free up memory space.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/device/performance/wx.onMemoryWarning.html)

## Type

```tsx
(callback: Callback) => void
```

## Parameters

### Callback

The callback function for the insufficient memory alarm event.

```tsx
(result: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>CallbackResult</code></td>
    </tr>
  </tbody>
</table>

### CallbackResult

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
      <td>level</td>
      <td><code>5 | 10 | 15</code></td>
      <td>Memory alarm level, only available in Android. It corresponds to the system macro definition.</td>
    </tr>
  </tbody>
</table>

### level

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>5</td>
      <td>TRIM_MEMORY_RUNNING_MODERATE</td>
    </tr>
    <tr>
      <td>10</td>
      <td>TRIM_MEMORY_RUNNING_LOW</td>
    </tr>
    <tr>
      <td>15</td>
      <td>TRIM_MEMORY_RUNNING_CRITICAL</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.onMemoryWarning(function () {
  console.log('onMemoryWarningReceive')
})
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onMemoryWarning | ✔️ |  |  |
