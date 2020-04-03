---
title: Taro.showToast(option)
sidebar_label: showToast
id: version-1.3.37-showToast
original_id: showToast
---

显示消息提示框

**注意**
- Taro.showLoading 和 Taro.showToast 同时只能显示一个
- Taro.showToast 应与 Taro.hideToast 配对使用

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showToast.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| title | `string` | 是 | 提示的内容 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| duration | `number` | 否 | 提示的延迟时间 |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| icon | `"success" | "loading" | "none"` | 否 | 图标<br /><br />可选值：<br />- 'success': 显示成功图标，此时 title 文本最多显示 7 个汉字长度;<br />- 'loading': 显示加载图标，此时 title 文本最多显示 7 个汉字长度;<br />- 'none': 不显示图标，此时 title 文本最多可显示两行 |
| image | `string` | 否 | 自定义图标的本地路径，image 的优先级高于 icon |
| mask | `boolean` | 否 | 是否显示透明蒙层，防止触摸穿透 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.showToast({
  title: '成功',
  icon: 'success',
  duration: 2000
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.showToast | ✔️ | ✔️ | ✔️ |
