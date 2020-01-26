---
title: Taro.getMenuButtonBoundingClientRect()
sidebar_label: getMenuButtonBoundingClientRect
---

获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/menu/wx.getMenuButtonBoundingClientRect.html)

## 类型

```tsx
() => Rect
```

## 参数

### Rect

菜单按钮的布局位置信息

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| bottom | `number` | 下边界坐标，单位：px |
| height | `number` | 高度，单位：px |
| left | `number` | 左边界坐标，单位：px |
| right | `number` | 右边界坐标，单位：px |
| top | `number` | 上边界坐标，单位：px |
| width | `number` | 宽度，单位：px |

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.getMenuButtonBoundingClientRect | ✔️ |  |  |  |  |  |  |  |
