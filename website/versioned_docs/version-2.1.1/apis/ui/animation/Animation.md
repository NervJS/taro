---
title: Animation
sidebar_label: Animation
id: version-2.1.1-Animation
original_id: Animation
---

## 方法

### export

导出动画队列。**export 方法每次调用后会清掉之前的动画操作。**

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.export.html)

```tsx
() => Record<string, any>[]
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.export | ✔️ |  |  |

### backgroundColor

设置背景色

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.backgroundColor.html)

```tsx
(value: string) => Animation
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
      <td>value</td>
      <td><code>string</code></td>
      <td>颜色值</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.backgroundColor | ✔️ |  |  |

### bottom

设置 bottom 值

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.bottom.html)

```tsx
(value: string | number) => Animation
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
      <td>value</td>
      <td><code>string | number</code></td>
      <td>长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.bottom | ✔️ |  |  |

### height

设置高度

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.height.html)

```tsx
(value: string | number) => Animation
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
      <td>value</td>
      <td><code>string | number</code></td>
      <td>长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.height | ✔️ |  |  |

### left

设置 left 值

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.left.html)

```tsx
(value: string | number) => Animation
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
      <td>value</td>
      <td><code>string | number</code></td>
      <td>长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.left | ✔️ |  |  |

### matrix

同 [transform-function matrix](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix)

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.matrix.html)

```tsx
() => Animation
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.matrix | ✔️ |  |  |

### matrix3d

同 [transform-function matrix3d](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d)

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.matrix3d.html)

```tsx
() => Animation
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.matrix3d | ✔️ |  |  |

### opacity

设置透明度

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.opacity.html)

```tsx
(value: number) => Animation
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
      <td>value</td>
      <td><code>number</code></td>
      <td>透明度，范围 0-1</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.opacity | ✔️ |  |  |

### right

设置 right 值

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.right.html)

```tsx
(value: string | number) => Animation
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
      <td>value</td>
      <td><code>string | number</code></td>
      <td>长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.right | ✔️ |  |  |

### rotate

从原点顺时针旋转一个角度

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.rotate.html)

```tsx
(angle: number) => Animation
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
      <td>angle</td>
      <td><code>number</code></td>
      <td>旋转的角度。范围 [-180, 180]</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.rotate | ✔️ |  |  |

### rotate3d

从 固定 轴顺时针旋转一个角度

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.rotate3d.html)

```tsx
(x: number, y: number, z: number, angle: number) => Animation
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
      <td>x</td>
      <td><code>number</code></td>
      <td>旋转轴的 x 坐标</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>旋转轴的 y 坐标</td>
    </tr>
    <tr>
      <td>z</td>
      <td><code>number</code></td>
      <td>旋转轴的 z 坐标</td>
    </tr>
    <tr>
      <td>angle</td>
      <td><code>number</code></td>
      <td>旋转的角度。范围 [-180, 180]</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.rotate3d | ✔️ |  |  |

### rotateX

从 X 轴顺时针旋转一个角度

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.rotateX.html)

```tsx
(angle: number) => Animation
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
      <td>angle</td>
      <td><code>number</code></td>
      <td>旋转的角度。范围 [-180, 180]</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.rotateX | ✔️ |  |  |

### rotateY

从 Y 轴顺时针旋转一个角度

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.rotateY.html)

```tsx
(angle: number) => Animation
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
      <td>angle</td>
      <td><code>number</code></td>
      <td>旋转的角度。范围 [-180, 180]</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.rotateY | ✔️ |  |  |

### rotateZ

从 Z 轴顺时针旋转一个角度

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.rotateZ.html)

```tsx
(angle: number) => Animation
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
      <td>angle</td>
      <td><code>number</code></td>
      <td>旋转的角度。范围 [-180, 180]</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.rotateZ | ✔️ |  |  |

### scale

缩放

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.scale.html)

```tsx
(sx: number, sy?: number) => Animation
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
      <td>sx</td>
      <td><code>number</code></td>
      <td>当仅有 sx 参数时，表示在 X 轴、Y 轴同时缩放sx倍数</td>
    </tr>
    <tr>
      <td>sy</td>
      <td><code>number</code></td>
      <td>在 Y 轴缩放 sy 倍数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.scale | ✔️ |  |  |

### scale3d

缩放

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.scale3d.html)

```tsx
(sx: number, sy: number, sz: number) => Animation
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
      <td>sx</td>
      <td><code>number</code></td>
      <td>x 轴的缩放倍数</td>
    </tr>
    <tr>
      <td>sy</td>
      <td><code>number</code></td>
      <td>y 轴的缩放倍数</td>
    </tr>
    <tr>
      <td>sz</td>
      <td><code>number</code></td>
      <td>z 轴的缩放倍数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.scale3d | ✔️ |  |  |

### scaleX

缩放 X 轴

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.scaleX.html)

```tsx
(scale: number) => Animation
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
      <td>scale</td>
      <td><code>number</code></td>
      <td>X 轴的缩放倍数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.scaleX | ✔️ |  |  |

### scaleY

缩放 Y 轴

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.scaleY.html)

```tsx
(scale: number) => Animation
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
      <td>scale</td>
      <td><code>number</code></td>
      <td>Y 轴的缩放倍数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.scaleY | ✔️ |  |  |

### scaleZ

缩放 Z 轴

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.scaleZ.html)

```tsx
(scale: number) => Animation
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
      <td>scale</td>
      <td><code>number</code></td>
      <td>Z 轴的缩放倍数</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.scaleZ | ✔️ |  |  |

### skew

对 X、Y 轴坐标进行倾斜

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.skew.html)

```tsx
(ax: number, ay: number) => Animation
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
      <td>ax</td>
      <td><code>number</code></td>
      <td>对 X 轴坐标倾斜的角度，范围 [-180, 180]</td>
    </tr>
    <tr>
      <td>ay</td>
      <td><code>number</code></td>
      <td>对 Y 轴坐标倾斜的角度，范围 [-180, 180]</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.skew | ✔️ |  |  |

### skewX

对 X 轴坐标进行倾斜

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.skewX.html)

```tsx
(angle: number) => Animation
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
      <td>angle</td>
      <td><code>number</code></td>
      <td>倾斜的角度，范围 [-180, 180]</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.skewX | ✔️ |  |  |

### skewY

对 Y 轴坐标进行倾斜

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.skewY.html)

```tsx
(angle: number) => Animation
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
      <td>angle</td>
      <td><code>number</code></td>
      <td>倾斜的角度，范围 [-180, 180]</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.skewY | ✔️ |  |  |

### step

表示一组动画完成。可以在一组动画中调用任意多个动画方法，一组动画中的所有动画会同时开始，一组动画完成后才会进行下一组动画。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.step.html)

```tsx
(option?: StepOption) => Animation
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>StepOption</code></td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.step | ✔️ |  |  |

### top

设置 top 值

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.top.html)

```tsx
(value: string | number) => Animation
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
      <td>value</td>
      <td><code>string | number</code></td>
      <td>长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.top | ✔️ |  |  |

### translate

平移变换

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.translate.html)

```tsx
(tx?: number, ty?: number) => Animation
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
      <td>tx</td>
      <td><code>number</code></td>
      <td>当仅有该参数时表示在 X 轴偏移 tx，单位 px</td>
    </tr>
    <tr>
      <td>ty</td>
      <td><code>number</code></td>
      <td>在 Y 轴平移的距离，单位为 px</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.translate | ✔️ |  |  |

### translate3d

对 xyz 坐标进行平移变换

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.translate3d.html)

```tsx
(tx?: number, ty?: number, tz?: number) => Animation
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
      <td>tx</td>
      <td><code>number</code></td>
      <td>在 X 轴平移的距离，单位为 px</td>
    </tr>
    <tr>
      <td>ty</td>
      <td><code>number</code></td>
      <td>在 Y 轴平移的距离，单位为 px</td>
    </tr>
    <tr>
      <td>tz</td>
      <td><code>number</code></td>
      <td>在 Z 轴平移的距离，单位为 px</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.translate3d | ✔️ |  |  |

### translateX

对 X 轴平移

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.translateX.html)

```tsx
(translation: number) => Animation
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
      <td>translation</td>
      <td><code>number</code></td>
      <td>在 X 轴平移的距离，单位为 px</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.translateX | ✔️ |  |  |

### translateY

对 Y 轴平移

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.translateY.html)

```tsx
(translation: number) => Animation
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
      <td>translation</td>
      <td><code>number</code></td>
      <td>在 Y 轴平移的距离，单位为 px</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.translateY | ✔️ |  |  |

### translateZ

对 Z 轴平移

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.translateZ.html)

```tsx
(translation: number) => Animation
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
      <td>translation</td>
      <td><code>number</code></td>
      <td>在 Z 轴平移的距离，单位为 px</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.translateZ | ✔️ |  |  |

### width

设置宽度

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.width.html)

```tsx
(value: string | number) => Animation
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
      <td>value</td>
      <td><code>string | number</code></td>
      <td>长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值</td>
    </tr>
  </tbody>
</table>

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.width | ✔️ |  |  |

## 参数

### StepOption

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
      <td>delay</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>动画延迟时间，单位 ms</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>动画持续时间，单位 ms</td>
    </tr>
    <tr>
      <td>timingFunction</td>
      <td><code>&quot;linear&quot; | &quot;ease&quot; | &quot;ease-in&quot; | &quot;ease-in-out&quot; | &quot;ease-out&quot; | &quot;step-start&quot; | &quot;step-end&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>动画的效果</td>
    </tr>
    <tr>
      <td>transformOrigin</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td></td>
    </tr>
  </tbody>
</table>

### timingFunction

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>linear</td>
      <td>动画从头到尾的速度是相同的</td>
    </tr>
    <tr>
      <td>ease</td>
      <td>动画以低速开始，然后加快，在结束前变慢</td>
    </tr>
    <tr>
      <td>ease-in</td>
      <td>动画以低速开始</td>
    </tr>
    <tr>
      <td>ease-in-out</td>
      <td>动画以低速开始和结束</td>
    </tr>
    <tr>
      <td>ease-out</td>
      <td>动画以低速结束</td>
    </tr>
    <tr>
      <td>step-start</td>
      <td>动画第一帧就跳至结束状态直到结束</td>
    </tr>
    <tr>
      <td>step-end</td>
      <td>动画一直保持开始状态，最后一帧跳到结束状态</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.export | ✔️ |  |  |
| Animation.backgroundColor | ✔️ |  |  |
| Animation.bottom | ✔️ |  |  |
| Animation.height | ✔️ |  |  |
| Animation.left | ✔️ |  |  |
| Animation.matrix | ✔️ |  |  |
| Animation.matrix3d | ✔️ |  |  |
| Animation.opacity | ✔️ |  |  |
| Animation.right | ✔️ |  |  |
| Animation.rotate | ✔️ |  |  |
| Animation.rotate3d | ✔️ |  |  |
| Animation.rotateX | ✔️ |  |  |
| Animation.rotateY | ✔️ |  |  |
| Animation.rotateZ | ✔️ |  |  |
| Animation.scale | ✔️ |  |  |
| Animation.scale3d | ✔️ |  |  |
| Animation.scaleX | ✔️ |  |  |
| Animation.scaleY | ✔️ |  |  |
| Animation.scaleZ | ✔️ |  |  |
| Animation.skew | ✔️ |  |  |
| Animation.skewX | ✔️ |  |  |
| Animation.skewY | ✔️ |  |  |
| Animation.step | ✔️ |  |  |
| Animation.top | ✔️ |  |  |
| Animation.translate | ✔️ |  |  |
| Animation.translate3d | ✔️ |  |  |
| Animation.translateX | ✔️ |  |  |
| Animation.translateY | ✔️ |  |  |
| Animation.translateZ | ✔️ |  |  |
| Animation.width | ✔️ |  |  |
