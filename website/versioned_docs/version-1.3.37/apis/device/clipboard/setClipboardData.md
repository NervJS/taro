---
title: Taro.setClipboardData(option)
sidebar_label: setClipboardData
id: version-1.3.37-setClipboardData
original_id: setClipboardData
---

设置系统剪贴板的内容。调用成功后，会弹出 toast 提示"内容已复制"，持续 1.5s

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/clipboard/wx.setClipboardData.html)

## 类型

```tsx
(option: Option) => Promise<Promised>
```

## 参数

### Promised

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 调用信息 |
| data | `string` | 剪贴板的内容 |

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| data | `string` | 是 | 剪贴板的内容 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.setClipboardData({
  data: 'data',
  success: function (res) {
    Taro.getClipboardData({
      success: function (res) {
        console.log(res.data) // data
      }
    })
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setClipboardData | ✔️ | ✔️(部分实现) | ✔️ |
