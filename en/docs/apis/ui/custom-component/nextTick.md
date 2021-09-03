---
title: Taro.nextTick(callback)
sidebar_label: nextTick
---

Defers some operations until the next time slice.(similar to setTimeout)

**说明** 因为自定义组件中的 setData 和 triggerEvent 等接口本身是同步的操作，当这几个接口被连续调用时，都是在一个同步流程中执行完的，因此若逻辑不当可能会导致出错。 For example, when the parent component's setData triggers the triggerEvent of the child component, and the parent component performs setData again, during which the child component is unloaded via the wx:if statement, an error may occur. So for logic that does not need to be done in a synchronous process, you can use this API to defer some operations until the next time slice.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/ui/custom-component/wx.nextTick.html)

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
this.setData({ number: 1 }) // Executes directly in the current synchronous process. Taro.nextTick(() => {
  this.setData({ number: 3 }) // After the current synchronous process ends, execute the operations in the next time slice. })
this.setData({ number: 2 }) // Executes directly in the current synchronous process.
```

## API Support

|      API      | WeChat Mini-Program | H5 | React Native |
|:-------------:|:-------------------:|:--:|:------------:|
| Taro.nextTick |         ✔️          |    |              |
