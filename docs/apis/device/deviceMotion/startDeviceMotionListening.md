---
title: Taro.startDeviceMotionListening(callback)
sidebar_label: startDeviceMotionListening
---

开始监听设备方向的变化。

## 参数

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| interval | <code>&#x27;game&#x27;</code> / <code>&#x27;ui&#x27;</code> / <code>&#x27;normal&#x27;</code> | <code>normal</code> | 监听设备方向回调函数的执行频率 game 适用于更新游戏的回调频率，在 20ms/次 左右 ui 适用于更新 UI 的回调频率，在 60ms/次 左右 normal 普通的回调频率，在 200ms/次 左右 |
| success | <code>function</code> |  | 接口调用成功的回调函数 |
| fail | <code>function</code> |  | 接口调用失败的回调函数 |
| complete | <code>function</code> |  | 接口调用结束的回调函数（调用成功、失败都会执行） |

<!-- ## 示例代码 -->

## API支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.startDeviceMotionListening | ✔️ | ✔️ | ✔️ |

