---
title: AuthSetting
sidebar_label: AuthSetting
---

用户授权设置信息，详情参考[权限](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)

## 方法

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| scope.userInfo | `boolean` | 否 | 是否授权用户信息，对应接口 [Taro.getUserInfo](/docs/apis/open-api/user-info/getUserInfo) |
| scope.userLocation | `boolean` | 否 | 是否授权地理位置，对应接口 [Taro.getLocation](/docs/apis/location/getLocation), [Taro.chooseLocation](/docs/apis/location/chooseLocation) |
| scope.address | `boolean` | 否 | 是否授权通讯地址，对应接口 [Taro.chooseAddress](/docs/apis/open-api/address/chooseAddress) |
| scope.invoiceTitle | `boolean` | 否 | 是否授权发票抬头，对应接口 [Taro.chooseInvoiceTitle](/docs/apis/open-api/invoice/chooseInvoiceTitle) |
| scope.invoice | `boolean` | 否 | 是否授权获取发票，对应接口 [Taro.chooseInvoice](/docs/apis/open-api/invoice/chooseInvoice) |
| scope.werun | `boolean` | 否 | 是否授权微信运动步数，对应接口 [Taro.getWeRunData](/docs/apis/open-api/werun/getWeRunData) |
| scope.record | `boolean` | 否 | 是否授权录音功能，对应接口 [Taro.startRecord](/docs/apis/media/recorder/startRecord) |
| scope.writePhotosAlbum | `boolean` | 否 | 是否授权保存到相册 [Taro.saveImageToPhotosAlbum](/docs/apis/media/image/saveImageToPhotosAlbum), [Taro.saveVideoToPhotosAlbum](/docs/apis/media/video/saveVideoToPhotosAlbum) |
| scope.camera | `boolean` | 否 | 是否授权摄像头，对应 [camera](/docs/components/media/camera) 组件 |
| scope.bluetoothBackground | `boolean` | 否 | 是否授权小程序在后台运行蓝牙，对应接口 [Taro.openBluetoothAdapterBackground](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/(wx.openBluetoothAdapterBackground).html) |
