---
title: Taro.chooseMessageFile(option)
sidebar_label: chooseMessageFile
---

从客户端会话选择文件。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.chooseMessageFile.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult>
```

## 参数

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| count | `number` | 是 | 最多可以选择的文件个数，可以 0～100 |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| extension | `string[]` | 否 | 根据文件拓展名过滤，仅 type==file 时有效。每一项都不能是空字符串。默认不过滤。 |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |
| type | `keyof SelectType` | 否 | 所选的文件的类型 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| tempFiles | `ChooseFile[]` | 返回选择的文件的本地临时文件对象数组 |
| errMsg | `string` | 调用结果 |

### ChooseFile

返回选择的文件的本地临时文件对象数组

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| name | `string` | 选择的文件名称 |
| path | `string` | 本地临时文件路径 |
| size | `number` | 本地临时文件大小，单位 B |
| time | `number` | 选择的文件的会话发送时间，Unix时间戳，工具暂不支持此属性 |
| type | `keyof SelectedType` | 选择的文件类型 |

### SelectType

| 参数 | 说明 |
| --- | --- |
| all | 从所有文件选择 |
| video | 只能选择视频文件 |
| image | 只能选择图片文件 |
| file | 可以选择除了图片和视频之外的其它的文件 |

### SelectedType

| 参数 | 说明 |
| --- | --- |
| video | 选择了视频文件 |
| image | 选择了图片文件 |
| file | 选择了除图片和视频的文件 |

## 示例代码

```tsx
Taro.chooseMessageFile({
  count: 10,
  type: 'image',
  success: function (res) {
    // tempFilePath可以作为img标签的src属性显示图片
    const tempFilePaths = res.tempFilePaths
  }
})
```
