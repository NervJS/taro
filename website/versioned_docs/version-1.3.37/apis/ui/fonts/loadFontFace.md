---
title: Taro.loadFontFace(option)
sidebar_label: loadFontFace
id: version-1.3.37-loadFontFace
original_id: loadFontFace
---

动态加载网络字体。文件地址需为下载类型。iOS 仅支持 https 格式文件地址。

注意：
1. 字体文件返回的 contet-type 参考 [font](https://www.iana.org/assignments/media-types/media-types.xhtml#font)，格式不正确时会解析失败。
2. 字体链接必须是https（ios不支持http)
3. 字体链接必须是同源下的，或开启了cors支持，小程序的域名是`servicewechat.com`
4. canvas等原生组件不支持使用接口添加的字体
5. 工具里提示 Faild to load font可以忽略

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/font/wx.loadFontFace.html)

## 类型

```tsx
(option: Option) => void
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| family | `string` | 是 | 定义的字体名称 |
| source | `string` | 是 | 字体资源的地址。建议格式为 TTF 和 WOFF，WOFF2 在低版本的iOS上会不兼容。 |
| complete | `CompleteCallback` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| desc | `DescOption` | 否 | 可选的字体描述符 |
| fail | `FailCallback` | 否 | 接口调用失败的回调函数 |
| success | `SuccessCallback` | 否 | 接口调用成功的回调函数 |

### DescOption

可选的字体描述符

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| style | `string` | 否 | 字体样式，可选值为 normal / italic / oblique |
| variant | `string` | 否 | 设置小型大写字母的字体显示文本，可选值为 normal / small-caps / inherit |
| weight | `string` | 否 | 字体粗细，可选值为 normal / bold / 100 / 200../ 900 |

### CompleteCallback

接口调用结束的回调函数（调用成功、失败都会执行）

```tsx
(result: CompleteCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CompleteCallbackResult` |

### FailCallback

接口调用失败的回调函数

```tsx
(result: FailCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `FailCallbackResult` |

### SuccessCallback

接口调用成功的回调函数

```tsx
(result: SuccessCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `SuccessCallbackResult` |

### CompleteCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| status | `string` | 加载字体结果 |

### FailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| status | `string` | 加载字体结果 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| status | `string` | 加载字体结果 |

## 示例代码

```tsx
Taro.loadFontFace({
  family: 'Bitstream Vera Serif Bold',
  source: 'url("https://sungd.github.io/Pacifico.ttf")',
  success: console.log
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.loadFontFace | ✔️ |  |  |
