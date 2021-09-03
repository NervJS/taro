---
title: CanvasGradient
sidebar_label: CanvasGradient
---

The gradient object.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasGradient.html)

## Methods

### addColorStop

Adds color gradient points.小于最小 stop 的部分会按最小 stop 的 color 来渲染，大于最大 stop 的部分会按最大 stop 的 color 来渲染

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasGradient.addColorStop.html)

```tsx
(stop: number, color: string) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>stop</td>
      <td><code>number</code></td>
      <td>Represents a position between the start and end of the gradient. Value range: 0-1.</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td>The color of the gradient point.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

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

#### API Support

|             API             | WeChat Mini-Program | H5 | React Native |
|:---------------------------:|:-------------------:|:--:|:------------:|
| CanvasGradient.addColorStop |         ✔️          |    |              |

## API Support

|             API             | WeChat Mini-Program | H5 | React Native |
|:---------------------------:|:-------------------:|:--:|:------------:|
| CanvasGradient.addColorStop |         ✔️          |    |              |
