---
title: IBeaconInfo
sidebar_label: IBeaconInfo
---

## 方法

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| uuid | `string` | Beacon 设备广播的 uuid |
| major | `string` | Beacon 设备的主 ID |
| minor | `string` | Beacon 设备的次 ID |
| proximity | `keyof Proximity` | 表示设备距离的枚举值（仅iOS） |
| accuracy | `number` | Beacon 设备的距离，单位 m。iOS 上，proximity 为 0 时，accuracy 为 -1。 |
| rssi | `number` | 表示设备的信号强度，单位 dBm |

## 参数

### Proximity

proximity 的合法值

| 参数 | 说明 |
| --- | --- |
| 0 | 信号太弱不足以计算距离，或非 iOS 设备 |
| 1 | 十分近 |
| 2 | 比较近 |
| 3 | 远 |
