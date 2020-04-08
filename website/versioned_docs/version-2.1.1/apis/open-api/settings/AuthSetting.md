---
title: AuthSetting
sidebar_label: AuthSetting
id: version-2.1.1-AuthSetting
original_id: AuthSetting
---

用户授权设置信息，详情参考[权限](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)

## 方法

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>scope.address</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否授权通讯地址，对应接口 <a href="https://developers.weixin.qq.com/miniprogram/dev/api/open-api/address/wx.chooseAddress.html">wx.chooseAddress</a></td>
    </tr>
    <tr>
      <td>scope.camera</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否授权摄像头，对应[<a href="https://developers.weixin.qq.com/miniprogram/dev/component/camera.html">camera</a>](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html) 组件</td>
    </tr>
    <tr>
      <td>scope.invoice</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否授权获取发票，对应接口 <a href="https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoice.html">wx.chooseInvoice</a></td>
    </tr>
    <tr>
      <td>scope.invoiceTitle</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否授权发票抬头，对应接口 <a href="https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoiceTitle.html">wx.chooseInvoiceTitle</a></td>
    </tr>
    <tr>
      <td>scope.record</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否授权录音功能，对应接口 <a href="https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.startRecord.html">wx.startRecord</a></td>
    </tr>
    <tr>
      <td>scope.userInfo</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否授权用户信息，对应接口 <a href="https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html">wx.getUserInfo</a></td>
    </tr>
    <tr>
      <td>scope.userLocation</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否授权地理位置，对应接口 <a href="https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html">wx.getLocation</a>, <a href="https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.chooseLocation.html">wx.chooseLocation</a></td>
    </tr>
    <tr>
      <td>scope.werun</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否授权微信运动步数，对应接口 <a href="https://developers.weixin.qq.com/miniprogram/dev/api/open-api/werun/wx.getWeRunData.html">wx.getWeRunData</a></td>
    </tr>
    <tr>
      <td>scope.writePhotosAlbum</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否授权保存到相册 <a href="https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html">wx.saveImageToPhotosAlbum</a>, <a href="https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.saveVideoToPhotosAlbum.html">wx.saveVideoToPhotosAlbum</a></td>
    </tr>
  </tbody>
</table>
