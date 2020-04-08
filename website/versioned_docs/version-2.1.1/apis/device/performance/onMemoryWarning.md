---
title: Taro.onMemoryWarning(callback)
sidebar_label: onMemoryWarning
id: version-2.1.1-onMemoryWarning
original_id: onMemoryWarning
---

监听内存不足告警事件。

当 iOS/Android 向小程序进程发出内存警告时，触发该事件。触发该事件不意味小程序被杀，大部分情况下仅仅是告警，开发者可在收到通知后回收一些不必要资源避免进一步加剧内存紧张。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/performance/wx.onMemoryWarning.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

内存不足告警事件的回调函数

```tsx
(result: CallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
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
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>level</td>
      <td><code>5 | 10 | 15</code></td>
      <td>内存告警等级，只有 Android 才有，对应系统宏定义</td>
    </tr>
  </tbody>
</table>

### level

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
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

## 示例代码

```tsx
Taro.onMemoryWarning(function () {
  console.log('onMemoryWarningReceive')
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onMemoryWarning | ✔️ |  |  |
