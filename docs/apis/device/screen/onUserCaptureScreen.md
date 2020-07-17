---
title: Taro.onUserCaptureScreen(callback)
sidebar_label: onUserCaptureScreen
---

监听用户主动截屏事件，用户使用系统截屏按键截屏时触发此事件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.onUserCaptureScreen.html)

## 类型

```tsx
(callback: (res: CallbackResult) => void) => void
```

## 参数

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
      <td>callback</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td>用户主动截屏事件的回调函数</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
Taro.onUserCaptureScreen(function (res) {
    console.log('用户截屏了')
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onUserCaptureScreen | ✔️ |  |  |
