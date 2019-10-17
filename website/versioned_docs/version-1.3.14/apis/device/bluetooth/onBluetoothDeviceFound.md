---
title: Taro.onBluetoothDeviceFound(CALLBACK)
sidebar_label: onBluetoothDeviceFound
id: version-1.3.14-onBluetoothDeviceFound
original_id: onBluetoothDeviceFound
---

使用方式同 [`wx.onBluetoothDeviceFound `](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onBluetoothDeviceFound.html)。

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.onBluetoothDeviceFound(devices => {
  console.log(devices)
  console.log(devices[0].advertisData)
})
```

  