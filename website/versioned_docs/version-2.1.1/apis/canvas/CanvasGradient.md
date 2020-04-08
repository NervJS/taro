---
title: CanvasGradient
sidebar_label: CanvasGradient
id: version-2.1.1-CanvasGradient
original_id: CanvasGradient
---

创建 canvas 的绘图上下文 CanvasContext 对象

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasGradient.html)

## 方法

### addColorStop

添加颜色的渐变点。小于最小 stop 的部分会按最小 stop 的 color 来渲染，大于最大 stop 的部分会按最大 stop 的 color 来渲染

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasGradient.addColorStop.html)

```tsx
(stop: number, color: string) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>stop</td>
      <td><code>number</code></td>
      <td>表示渐变中开始与结束之间的位置，范围 0-1。</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td>渐变点的颜色。</td>
    </tr>
  </tbody>
</table>

#### 示例代码

```tsx
const ctx = Taro.createCanvasContext('myCanvas')
// Create circular gradient
const grd = ctx.createLinearGradient(30, 10, 120, 10)
grd.addColorStop(0, 'red')
grd.addColorStop(0.16, 'orange')
grd.addColorStop(0.33, 'yellow')
grd.addColorStop(0.5, 'green')
grd.addColorStop(0.66, 'cyan')
grd.addColorStop(0.83, 'blue')
grd.addColorStop(1, 'purple')
// Fill with gradient
ctx.setFillStyle(grd)
ctx.fillRect(10, 10, 150, 80)
ctx.draw()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasGradient.addColorStop | ✔️ |  |  |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasGradient.addColorStop | ✔️ |  |  |
