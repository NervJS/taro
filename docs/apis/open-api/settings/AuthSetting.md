---
title: AuthSetting
sidebar_label: AuthSetting
---

用户授权设置信息，详情参考[权限](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)

## 方法

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| scope.userInfo | `boolean` | 否 | 是否授权用户信息，对应接口 [Taro.getUserInfo](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html) |
| scope.userLocation | `boolean` | 否 | 是否授权地理位置，对应接口 [Taro.getLocation](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html), [Taro.chooseLocation](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.chooseLocation.html) |
| scope.address | `boolean` | 否 | 是否授权通讯地址，对应接口 [Taro.chooseAddress](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/address/wx.chooseAddress.html) |
| scope.invoiceTitle | `boolean` | 否 | 是否授权发票抬头，对应接口 [Taro.chooseInvoiceTitle](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoiceTitle.html) |
| scope.invoice | `boolean` | 否 | 是否授权获取发票，对应接口 [Taro.chooseInvoice](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoice.html) |
| scope.werun | `boolean` | 否 | 是否授权微信运动步数，对应接口 [Taro.getWeRunData](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/werun/wx.getWeRunData.html) |
| scope.record | `boolean` | 否 | 是否授权录音功能，对应接口 [Taro.startRecord](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.startRecord.html) |
| scope.writePhotosAlbum | `boolean` | 否 | 是否授权保存到相册 [Taro.saveImageToPhotosAlbum](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html), [Taro.saveVideoToPhotosAlbum](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.saveVideoToPhotosAlbum.html) |
| scope.camera | `boolean` | 否 | 是否授权摄像头，对应[[camera](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html)](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html) 组件 |
| scope.bluetoothBackground | `boolean` | 否 | 是否授权小程序在后台运行蓝牙，对应接口 [Taro.openBluetoothAdapterBackground](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/(wx.openBluetoothAdapterBackground)) |
