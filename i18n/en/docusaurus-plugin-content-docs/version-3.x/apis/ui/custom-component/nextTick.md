---
title: Taro.nextTick(callback)
sidebar_label: nextTick
---

Defers some operations until the next time slice. (similar to setTimeout)

**Note**

The APIs such as setData and triggerEvent in the custom component perform synchronous operations. When these APIs are continuously called, they are executed in a synchronous process, so if the logic is improper, an error may occur.

For example, when the parent component's setData triggers the triggerEvent of the child component, and the parent component performs setData again, during which the child component is unloaded via the wx:if statement, an error may occur. So for logic that does not need to be done in a synchronous process, you can use this API to defer some operations until the next time slice.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/custom-component/wx.nextTick.html)

## Type

```tsx
(callback: (...args: any[]) => any) => void
```

## Parameters

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>callback</td>
      <td><code>(...args: any[]) =&gt; any</code></td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
this.setData({ number: 1 }) // Executes directly in the current synchronous process.
Taro.nextTick(() => {
  this.setData({ number: 3 }) // After the current synchronous process ends, execute the operations in the next time slice.
})
this.setData({ number: 2 }) // Executes directly in the current synchronous process.
```

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.nextTick | ✔️ |  |  |
