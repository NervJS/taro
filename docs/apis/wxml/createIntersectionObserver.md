---
title: Taro.createIntersectionObserver(component, options)
sidebar_label: createIntersectionObserver
---

创建并返回一个 IntersectionObserver 对象实例。在自定义组件或包含自定义组件的页面中，应使用 `this.createIntersectionObserver([options])` 来代替。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/wx.createSelectorQuery.html)

## 类型

```tsx
(component: Record<string, any>, options?: Option) => IntersectionObserver
```

## 参数

### Option

选项

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| initialRatio | `number` | 否 | 初始的相交比例，如果调用时检测到的相交比例与这个值不相等且达到阈值，则会触发一次监听器的回调函数。 |
| observeAll | `boolean` | 否 | 是否同时观测多个目标节点（而非一个），如果设为 true ，observe 的 targetSelector 将选中多个节点（注意：同时选中过多节点将影响渲染性能） |
| thresholds | `number[]` | 否 | 一个数值数组，包含所有阈值。 |

## 示例代码

```tsx
const observer = Taro.createIntersectionObserver(this, { thresholds: [0], observeAll: true })
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createIntersectionObserver | ✔️ |  |  |
