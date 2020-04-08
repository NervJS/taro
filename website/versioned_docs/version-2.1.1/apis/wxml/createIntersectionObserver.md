---
title: Taro.createIntersectionObserver(component, options)
sidebar_label: createIntersectionObserver
id: version-2.1.1-createIntersectionObserver
original_id: createIntersectionObserver
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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>initialRatio</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>初始的相交比例，如果调用时检测到的相交比例与这个值不相等且达到阈值，则会触发一次监听器的回调函数。</td>
    </tr>
    <tr>
      <td>observeAll</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否同时观测多个目标节点（而非一个），如果设为 true ，observe 的 targetSelector 将选中多个节点（注意：同时选中过多节点将影响渲染性能）</td>
    </tr>
    <tr>
      <td>thresholds</td>
      <td><code>number[]</code></td>
      <td style="text-align:center">否</td>
      <td>一个数值数组，包含所有阈值。</td>
    </tr>
  </tbody>
</table>

## 示例代码

```tsx
const observer = Taro.createIntersectionObserver(this, { thresholds: [0], observeAll: true })
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.createIntersectionObserver | ✔️ |  |  |
