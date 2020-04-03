---
title: Taro.onMemoryWarning(callback)
sidebar_label: onMemoryWarning
id: version-1.3.37-onMemoryWarning
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

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| level | `5 | 10 | 15` | 内存告警等级，只有 Android 才有，对应系统宏定义 |

### level

| 参数 | 说明 |
| --- | --- |
| 5 | TRIM_MEMORY_RUNNING_MODERATE |
| 10 | TRIM_MEMORY_RUNNING_LOW |
| 15 | TRIM_MEMORY_RUNNING_CRITICAL |

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
