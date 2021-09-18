---
title: Animation
sidebar_label: Animation
---

## Methods

### export

Exports the animation queue. **The "export" method clears the previous animation operations each time it is called.**

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.export.html)

```tsx
() => Record<string, any>[]
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.export | ✔️ |  |  |

### backgroundColor

Sets the background color.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.backgroundColor.html)

```tsx
(value: string) => Animation
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
      <td>value</td>
      <td><code>string</code></td>
      <td>Color value</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.backgroundColor | ✔️ |  |  |

### bottom

Sets the bottom value.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.bottom.html)

```tsx
(value: string | number) => Animation
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
      <td>value</td>
      <td><code>string | number</code></td>
      <td>Length value. If number is input, px is used by default. Other length values in custom units can be passed.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.bottom | ✔️ |  |  |

### height

Sets the height.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.height.html)

```tsx
(value: string | number) => Animation
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
      <td>value</td>
      <td><code>string | number</code></td>
      <td>Length value. If number is input, px is used by default. Other length values in custom units can be passed.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.height | ✔️ |  |  |

### left

Set the left value

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.left.html)

```tsx
(value: string | number) => Animation
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
      <td>value</td>
      <td><code>string | number</code></td>
      <td>Length value. If number is input, px is used by default. Other length values in custom units can be passed.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.left | ✔️ |  |  |

### matrix

Similar to [transform-function matrix](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix).

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.matrix.html)

```tsx
() => Animation
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.matrix | ✔️ |  |  |

### matrix3d

Similar to [transform-function matrix3d](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d).

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.matrix3d.html)

```tsx
() => Animation
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.matrix3d | ✔️ |  |  |

### opacity

Sets the transparency.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.opacity.html)

```tsx
(value: number) => Animation
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
      <td>value</td>
      <td><code>number</code></td>
      <td>Transparency. It ranges from 0 to 1.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.opacity | ✔️ |  |  |

### right

Sets the right value.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.right.html)

```tsx
(value: string | number) => Animation
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
      <td>value</td>
      <td><code>string | number</code></td>
      <td>Length value. If number is input, px is used by default. Other length values in custom units can be passed.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.right | ✔️ |  |  |

### rotate

Rotates some degrees clockwise from the origin.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.rotate.html)

```tsx
(angle: number) => Animation
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
      <td>angle</td>
      <td><code>number</code></td>
      <td>Rotation degree value. It ranges from -180 to 180.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.rotate | ✔️ |  |  |

### rotate3d

Rotates the x-axis some degrees clockwise.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.rotate3d.html)

```tsx
(x: number, y: number, z: number, angle: number) => Animation
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
      <td>x</td>
      <td><code>number</code></td>
      <td>X coordinate of the rotational axis</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td>Y coordinate of the rotational axis</td>
    </tr>
    <tr>
      <td>z</td>
      <td><code>number</code></td>
      <td>Z coordinate of the rotational axis</td>
    </tr>
    <tr>
      <td>angle</td>
      <td><code>number</code></td>
      <td>Rotation degree value. It ranges from -180 to 180.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.rotate3d | ✔️ |  |  |

### rotateX

Rotates the x-axis some degrees clockwise.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.rotateX.html)

```tsx
(angle: number) => Animation
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
      <td>angle</td>
      <td><code>number</code></td>
      <td>Rotation degree value. It ranges from -180 to 180.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.rotateX | ✔️ |  |  |

### rotateY

Rotates the y-axis some degrees clockwise.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.rotateY.html)

```tsx
(angle: number) => Animation
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
      <td>angle</td>
      <td><code>number</code></td>
      <td>Rotation degree value. It ranges from -180 to 180.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.rotateY | ✔️ |  |  |

### rotateZ

Rotates the z-axis some degrees clockwise.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.rotateZ.html)

```tsx
(angle: number) => Animation
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
      <td>angle</td>
      <td><code>number</code></td>
      <td>Rotation degree value. It ranges from -180 to 180.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.rotateZ | ✔️ |  |  |

### scale

Zooms in/out

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.scale.html)

```tsx
(sx: number, sy?: number) => Animation
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
      <td>sx</td>
      <td><code>number</code></td>
      <td>Zoom in/out the x- and y-axises according to a scale of s if only the sx parameter exists.</td>
    </tr>
    <tr>
      <td>sy</td>
      <td><code>number</code></td>
      <td>Zoom in/out the y-axis according to a scale of sy.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.scale | ✔️ |  |  |

### scale3d

Zooms in/out

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.scale3d.html)

```tsx
(sx: number, sy: number, sz: number) => Animation
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
      <td>sx</td>
      <td><code>number</code></td>
      <td>The scale according to which the x-axis is zoomed in/out.</td>
    </tr>
    <tr>
      <td>sy</td>
      <td><code>number</code></td>
      <td>The scale according to which the y-axis is zoomed in/out.</td>
    </tr>
    <tr>
      <td>sz</td>
      <td><code>number</code></td>
      <td>The scale according to which the z-axis is zoomed in/out.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.scale3d | ✔️ |  |  |

### scaleX

Zooms in/out the x-axis.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.scaleX.html)

```tsx
(scale: number) => Animation
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
      <td>scale</td>
      <td><code>number</code></td>
      <td>The scale according to which the x-axis is zoomed in/out.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.scaleX | ✔️ |  |  |

### scaleY

Zooms in/out the y-axis.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.scaleY.html)

```tsx
(scale: number) => Animation
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
      <td>scale</td>
      <td><code>number</code></td>
      <td>The scale according to which the y-axis is zoomed in/out.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.scaleY | ✔️ |  |  |

### scaleZ

Zooms in/out the z-axis.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.scaleZ.html)

```tsx
(scale: number) => Animation
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
      <td>scale</td>
      <td><code>number</code></td>
      <td>The scale according to which the z-axis is zoomed in/out.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.scaleZ | ✔️ |  |  |

### skew

Skews the X- and Y-coordinates.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.skew.html)

```tsx
(ax: number, ay: number) => Animation
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
      <td>ax</td>
      <td><code>number</code></td>
      <td>The angle the x-coordinate is skewed. It ranges from -180 to 180.</td>
    </tr>
    <tr>
      <td>ay</td>
      <td><code>number</code></td>
      <td>The angle the y-coordinate is skewed. It ranges from -180 to 180.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.skew | ✔️ |  |  |

### skewX

Skews the x-coordinate.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.skewX.html)

```tsx
(angle: number) => Animation
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
      <td>angle</td>
      <td><code>number</code></td>
      <td>Skewed angle. It ranges from -180 to 180.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.skewX | ✔️ |  |  |

### skewY

Skews the Y-coordinate.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.skewY.html)

```tsx
(angle: number) => Animation
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
      <td>angle</td>
      <td><code>number</code></td>
      <td>Skewed angle. It ranges from -180 to 180.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.skewY | ✔️ |  |  |

### step

It indicates the completion of a queue of animations. You can call as many animation methods as needed in a queue of animations. All animations in a queue start at the same time, and the next queue of animations will not start until the completion of the current queue.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.step.html)

```tsx
(option?: StepOption) => Animation
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>option</td>
      <td><code>StepOption</code></td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.step | ✔️ |  |  |

### top

Sets the top value.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.top.html)

```tsx
(value: string | number) => Animation
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
      <td>value</td>
      <td><code>string | number</code></td>
      <td>Length value. If number is input, px is used by default. Other length values in custom units can be passed.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.top | ✔️ |  |  |

### translate

Translate

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.translate.html)

```tsx
(tx?: number, ty?: number) => Animation
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
      <td>tx</td>
      <td><code>number</code></td>
      <td>If only this parameter is specified, translate along the x-axis by tx (in px).
</td>
    </tr>
    <tr>
      <td>ty</td>
      <td><code>number</code></td>
      <td>The distance to translate along the y-axis, in pixels.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.translate | ✔️ |  |  |

### translate3d

Translates the x-, y-, and z-coordinates.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.translate3d.html)

```tsx
(tx?: number, ty?: number, tz?: number) => Animation
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
      <td>tx</td>
      <td><code>number</code></td>
      <td>The distance to translate along the x-axis, in pixels.</td>
    </tr>
    <tr>
      <td>ty</td>
      <td><code>number</code></td>
      <td>The distance to translate along the y-axis, in pixels.</td>
    </tr>
    <tr>
      <td>tz</td>
      <td><code>number</code></td>
      <td>The distance to translate along the z-axis, in pixels.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.translate3d | ✔️ |  |  |

### translateX

Translates the x-axis.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.translateX.html)

```tsx
(translation: number) => Animation
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
      <td>translation</td>
      <td><code>number</code></td>
      <td>The distance to translate along the x-axis, in pixels.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.translateX | ✔️ |  |  |

### translateY

Translates the y-axis.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.translateY.html)

```tsx
(translation: number) => Animation
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
      <td>translation</td>
      <td><code>number</code></td>
      <td>The distance to translate along the y-axis, in pixels.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.translateY | ✔️ |  |  |

### translateZ

Translates the z-axis.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.translateZ.html)

```tsx
(translation: number) => Animation
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
      <td>translation</td>
      <td><code>number</code></td>
      <td>The distance to translate along the z-axis, in pixels.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.translateZ | ✔️ |  |  |

### width

Sets the width.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/ui/animation/Animation.width.html)

```tsx
(value: string | number) => Animation
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
      <td>value</td>
      <td><code>string | number</code></td>
      <td>Length value. If number is input, px is used by default. Other length values in custom units can be passed.</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Animation.width | ✔️ |  |  |

## Parameters

### StepOption

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>delay</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Animation delay time (in ms)</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Animation duration (in ms)</td>
    </tr>
    <tr>
      <td>timingFunction</td>
      <td><code>&quot;linear&quot; | &quot;ease&quot; | &quot;ease-in&quot; | &quot;ease-in-out&quot; | &quot;ease-out&quot; | &quot;step-start&quot; | &quot;step-end&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Animation effect</td>
    </tr>
    <tr>
      <td>transformOrigin</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td></td>
    </tr>
  </tbody>
</table>

### timingFunction

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>linear</td>
      <td>The animation keeps the same speed from start to end</td>
    </tr>
    <tr>
      <td>ease</td>
      <td>The animation starts slow, then speeds up, and then slows down before ending.</td>
    </tr>
    <tr>
      <td>ease-in</td>
      <td>The animation starts at low speed</td>
    </tr>
    <tr>
      <td>ease-in-out</td>
      <td>The animation starts and ends at low speed</td>
    </tr>
    <tr>
      <td>ease-out</td>
      <td>The animation ends at low speed</td>
    </tr>
    <tr>
      <td>step-start</td>
      <td>The first frame of the animation jumps to the end state until the animation ends</td>
    </tr>
    <tr>
      <td>step-end</td>
      <td>The animation remains the start state until the final frame jumps to the end state</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
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
