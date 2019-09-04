---
title: Taro.onBluetoothAdapterStateChange(CALLBACK)
sidebar_label: onBluetoothAdapterStateChange
id: version-1.3.14-onBluetoothAdapterStateChange
original_id: onBluetoothAdapterStateChange
---

使用方式同 [`wx.onBluetoothAdapterStateChange`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onBluetoothAdapterStateChange.html)。

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.onBluetoothAdapterStateChange(res => {
  console.log(`adapterState changed, now is`, res)
})
```

  