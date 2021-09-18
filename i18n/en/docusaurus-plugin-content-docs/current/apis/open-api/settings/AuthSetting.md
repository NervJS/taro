---
title: AuthSetting
sidebar_label: AuthSetting
---

Some of the APIs need users’ authorization before they can be called. We have divided these APIs into multiple `scope` according to the `scope` of usage. The users can select `scope` to authorize. After a `scope` is authorized, all of its APIs can be used directly.

When such an API is called:

- If the user has not accepted or rejected this authorization, a pop-up window will appear to ask the user if he/she wants to accept. The API can be called only after the user clicks to accept;
- If the user has accepted authorization, the API can be called directly;
- If the user has rejected authorization, no pop-up appears. Instead, API fail callback will be accessed directly. **Developers should make the scenario compatible where the user has rejected to authorization.**

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/authorize.html)

## Methods

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>scope.address</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Postal address. <a href="https://developers.weixin.qq.com/miniprogram/dev/api/open-api/address/wx.chooseAddress.html">wx.chooseAddress</a></td>
    </tr>
    <tr>
      <td>scope.camera</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Camera. [<a href="https://developers.weixin.qq.com/miniprogram/dev/component/camera.html">camera</a>](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html) component</td>
    </tr>
    <tr>
      <td>scope.invoice</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Gets invoice. <a href="https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoice.html">wx.chooseInvoice</a></td>
    </tr>
    <tr>
      <td>scope.invoiceTitle</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Invoice title. <a href="https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoiceTitle.html">wx.chooseInvoiceTitle</a></td>
    </tr>
    <tr>
      <td>scope.record</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Recording feature. <a href="https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.startRecord.html">wx.startRecord</a></td>
    </tr>
    <tr>
      <td>scope.userInfo</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>User information. <a href="https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html">wx.getUserInfo</a></td>
    </tr>
    <tr>
      <td>scope.userLocation</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Geographic location. <a href="https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html">wx.getLocation</a>, <a href="https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.chooseLocation.html">wx.chooseLocation</a></td>
    </tr>
    <tr>
      <td>scope.werun</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>WeRun step counts. <a href="https://developers.weixin.qq.com/miniprogram/dev/api/open-api/werun/wx.getWeRunData.html">wx.getWeRunData</a></td>
    </tr>
    <tr>
      <td>scope.writePhotosAlbum</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Saves to album. <a href="https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html">wx.saveImageToPhotosAlbum</a>, <a href="https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.saveVideoToPhotosAlbum.html">wx.saveVideoToPhotosAlbum</a></td>
    </tr>
  </tbody>
</table>
