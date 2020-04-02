---
title: Animation
sidebar_label: Animation
id: version-1.3.38-Animation
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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| value | `string` | 颜色值 |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| value | string or number | 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值 |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| value | string or number | 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值 |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| value | string or number | 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值 |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| value | `number` | 透明度，范围 0-1 |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| value | string or number | 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值 |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| angle | `number` | 旋转的角度。范围 [-180, 180] |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| x | `number` | 旋转轴的 x 坐标 |
| y | `number` | 旋转轴的 y 坐标 |
| z | `number` | 旋转轴的 z 坐标 |
| angle | `number` | 旋转的角度。范围 [-180, 180] |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| angle | `number` | 旋转的角度。范围 [-180, 180] |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| angle | `number` | 旋转的角度。范围 [-180, 180] |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| angle | `number` | 旋转的角度。范围 [-180, 180] |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| sx | `number` | 当仅有 sx 参数时，表示在 X 轴、Y 轴同时缩放sx倍数 |
| sy | `number` | 在 Y 轴缩放 sy 倍数 |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| sx | `number` | x 轴的缩放倍数 |
| sy | `number` | y 轴的缩放倍数 |
| sz | `number` | z 轴的缩放倍数 |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| scale | `number` | X 轴的缩放倍数 |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| scale | `number` | Y 轴的缩放倍数 |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| scale | `number` | Z 轴的缩放倍数 |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| ax | `number` | 对 X 轴坐标倾斜的角度，范围 [-180, 180] |
| ay | `number` | 对 Y 轴坐标倾斜的角度，范围 [-180, 180] |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| angle | `number` | 倾斜的角度，范围 [-180, 180] |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| angle | `number` | 倾斜的角度，范围 [-180, 180] |

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

| 参数 | 类型 |
| --- | --- |
| option | `StepOption` |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| value | string or number | 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值 |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| tx | `number` | 当仅有该参数时表示在 X 轴偏移 tx，单位 px |
| ty | `number` | 在 Y 轴平移的距离，单位为 px |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| tx | `number` | 在 X 轴平移的距离，单位为 px |
| ty | `number` | 在 Y 轴平移的距离，单位为 px |
| tz | `number` | 在 Z 轴平移的距离，单位为 px |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| translation | `number` | 在 X 轴平移的距离，单位为 px |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| translation | `number` | 在 Y 轴平移的距离，单位为 px |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| translation | `number` | 在 Z 轴平移的距离，单位为 px |

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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| value | string or number | 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.width | ✔️ |  |  |

## 参数

### StepOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| delay | `number` | 否 | 动画延迟时间，单位 ms |
| duration | `number` | 否 | 动画持续时间，单位 ms |
| timingFunction | "linear" or "ease" or "ease-in" or "ease-in-out" or "ease-out" or "step-start" or "step-end" | 否 | 动画的效果 |
| transformOrigin | `string` | 否 |  |

### timingFunction

| 参数 | 说明 |
| --- | --- |
| linear | 动画从头到尾的速度是相同的 |
| ease | 动画以低速开始，然后加快，在结束前变慢 |
| ease-in | 动画以低速开始 |
| ease-in-out | 动画以低速开始和结束 |
| ease-out | 动画以低速结束 |
| step-start | 动画第一帧就跳至结束状态直到结束 |
| step-end | 动画一直保持开始状态，最后一帧跳到结束状态 |

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
