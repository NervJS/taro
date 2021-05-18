---
title: Progress
sidebar_label: Progress
---

progress。 The unit of length of the component's properties is px by default.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/progress.html)

## Type

```tsx
ComponentType<ProgressProps>
```

## Examples


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="React"
  values={[
    {label: 'React', value: 'React'},
    {label: 'Vue', value: 'Vue'}
  ]}>
<TabItem value="React">

```tsx
export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <View className='components-page'>
        <Progress percent={20} showInfo strokeWidth={2} />
        <Progress percent={40} strokeWidth={2} active />
        <Progress percent={60}  strokeWidth={2} active />
        <Progress percent={80}  strokeWidth={2} active activeColor='blue' />
      </View>
    )
  }
}
```

</TabItem>

<TabItem value="Vue">

```html
<template>
  <view class="components-page">
    <progress percent="20" stroke-width="2" :show-info="true" />
    <progress percent="40" stroke-width="2" :active="true" />
    <progress percent="60" stroke-width="2" :active="true" />
    <progress percent="80" stroke-width="2" :active="true" active-color="blue" />
  </view>
</template>
```
  
</TabItem>
</Tabs>

## ProgressProps

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Default</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>percent</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>0 to 100 percent.</td>
    </tr>
    <tr>
      <td>showInfo</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Shows the percent on the right of the progress bar.</td>
    </tr>
    <tr>
      <td>borderRadius</td>
      <td><code>string | number</code></td>
      <td style={{ textAlign: "center"}}><code>0</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The radius of the round corner.</td>
    </tr>
    <tr>
      <td>fontSize</td>
      <td><code>string | number</code></td>
      <td style={{ textAlign: "center"}}><code>16</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The font size of the percent on the right.</td>
    </tr>
    <tr>
      <td>strokeWidth</td>
      <td><code>string | number</code></td>
      <td style={{ textAlign: "center"}}><code>6</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The width of the stroke on the progress bar.</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;#09BB07&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The color of the progress bar (Use activeColor).</td>
    </tr>
    <tr>
      <td>activeColor</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;#09BB07&quot;</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>The color of the selected progress bar.</td>
    </tr>
    <tr>
      <td>backgroundColor</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;#EBEBEB&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The color of the unselected progress bar.</td>
    </tr>
    <tr>
      <td>active</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The animation where the progress bar moves from left to right.</td>
    </tr>
    <tr>
      <td>activeMode</td>
      <td><code>&quot;backwards&quot; | &quot;forwards&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>backwards</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>The value "backwards" indicates that the animation plays from the beginning, and the value "forwards" indicates that the animation plays from the point at which it paused.</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>30</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Number of milliseconds to increase progress by 1%.</td>
    </tr>
    <tr>
      <td>onActiveEnd</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered on animation completion.</td>
    </tr>
  </tbody>
</table>

### Property Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| ProgressProps.percent | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ProgressProps.showInfo | ✔️ | ✔️ | ✔️ |  | ✔️ | ✔️ |
| ProgressProps.borderRadius | ✔️ |  |  |  | ✔️ |  |
| ProgressProps.fontSize | ✔️ |  |  |  | ✔️ |  |
| ProgressProps.strokeWidth | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ProgressProps.color | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
| ProgressProps.activeColor | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ProgressProps.backgroundColor | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ProgressProps.active | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ProgressProps.activeMode | ✔️ | ✔️ |  | ✔️ | ✔️ | ✔️ |
| ProgressProps.duration | ✔️ |  |  |  | ✔️ |  |
| ProgressProps.onActiveEnd | ✔️ |  |  |  | ✔️ |  |

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Progress | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
