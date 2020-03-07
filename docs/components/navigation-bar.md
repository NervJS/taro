---
title: NavigationBar
sidebar_label: NavigationBar
---

页面导航条配置节点，用于指定导航栏的一些属性。只能是 PageMeta 组件内的第一个节点，需要配合它一同使用。
通过这个节点可以获得类似于调用 Taro.setNavigationBarTitle Taro.setNavigationBarColor 等接口调用的效果。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/open-data.html)

## 类型

```tsx
ComponentType<NavigationBarProps>
```

## NavigationBarProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| title | `string` |  | 否 | 导航条标题 |
| loading | `boolean` |  | 否 | 是否在导航条显示 loading 加载提示 |
| frontColor | `string` |  | 否 | 导航条前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000 |
| backgroundColor | `string` |  | 否 | 导航条背景颜色值，有效值为十六进制颜色 |
| colorAnimationDuration | `string` | `0` | 否 | 改变导航栏颜色时的动画时长，默认为 0 （即没有动画效果） |
| colorAnimationTimingFunc | "linear" or "easeIn" or "easeOut" or "easeInOut" | `"linear"` | 否 | 改变导航栏颜色时的动画方式，支持 linear 、 easeIn 、 easeOut 和 easeInOut |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| NavigationBarProps.title | ✔️ |  |  |
| NavigationBarProps.loading | ✔️ |  |  |
| NavigationBarProps.frontColor | ✔️ |  |  |
| NavigationBarProps.backgroundColor | ✔️ |  |  |
| NavigationBarProps.colorAnimationDuration | ✔️ |  |  |
| NavigationBarProps.colorAnimationTimingFunc | ✔️ |  |  |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| NavigationBar | ✔️ |  |  |
