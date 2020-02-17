---
title: Taro.canvasToTempFilePath(option, component)
sidebar_label: canvasToTempFilePath
---

把当前画布指定区域的内容导出生成指定大小的图片。在 `draw()` 回调里调用该方法才能保证图片导出成功。

**Bug & Tip：**

1.  `tip`: 在 `draw` 回调里调用该方法才能保证图片导出成功。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.canvasToTempFilePath.html)

## 类型

```tsx
(option: Option, component?: Record<string, any>) => Promise<SuccessCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| canvas | `string` |  | 否 | 画布标识，传入 [canvas](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) 组件实例 （canvas type="2d" 时使用该属性）。 |
| canvasId | `string` |  | 是 | 画布标识，传入 [canvas](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) 组件的 canvas-id |
| quality | `number` |  | 否 | 图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。 |
| complete | `(res: CallbackResult) => void` |  | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| destHeight | `number` |  | 否 | 输出的图片的高度 |
| destWidth | `number` |  | 否 | 输出的图片的宽度 |
| fail | `(res: CallbackResult) => void` |  | 否 | 接口调用失败的回调函数 |
| fileType | "jpg" or "png" | `"png"` | 否 | 目标文件的类型 |
| height | `number` |  | 否 | 指定的画布区域的高度 |
| success | `(result: SuccessCallbackResult) => void` |  | 否 | 接口调用成功的回调函数 |
| width | `number` |  | 否 | 指定的画布区域的宽度 |
| x | `number` |  | 否 | 指定的画布区域的左上角横坐标 |
| y | `number` |  | 否 | 指定的画布区域的左上角纵坐标 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| tempFilePath | `string` | 生成文件的临时路径 |
| errMsg | `string` | 调用结果 |

### fileType

| 参数 | 说明 |
| --- | --- |
| jpg | jpg 图片 |
| png | png 图片 |

## 示例代码

```tsx
Taro.canvasToTempFilePath({
  x: 100,
  y: 200,
  width: 50,
  height: 50,
  destWidth: 100,
  destHeight: 100,
  canvasId: 'myCanvas',
  success: function (res) {
    console.log(res.tempFilePath)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.canvasToTempFilePath | ✔️ | ✔️ |  |
