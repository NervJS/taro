---
title: Progress
sidebar_label: Progress
---

进度条。组件属性的长度单位默认为 px

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/progress.html)

## 类型

```tsx
ComponentType<ProgressProps>
```

## 示例代码


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
      <th>参数</th>
      <th>类型</th>
      <th style={{ textAlign: "center"}}>默认值</th>
      <th style={{ textAlign: "center"}}>必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>percent</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>百分比 0~100</td>
    </tr>
    <tr>
      <td>showInfo</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>在进度条右侧显示百分比</td>
    </tr>
    <tr>
      <td>borderRadius</td>
      <td><code>string | number</code></td>
      <td style={{ textAlign: "center"}}><code>0</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>圆角大小</td>
    </tr>
    <tr>
      <td>fontSize</td>
      <td><code>string | number</code></td>
      <td style={{ textAlign: "center"}}><code>16</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>右侧百分比字体大小</td>
    </tr>
    <tr>
      <td>strokeWidth</td>
      <td><code>string | number</code></td>
      <td style={{ textAlign: "center"}}><code>6</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>进度条线的宽度</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;#09BB07&quot;</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>进度条颜色 (请使用 activeColor)</td>
    </tr>
    <tr>
      <td>activeColor</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;#09BB07&quot;</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>已选择的进度条的颜色</td>
    </tr>
    <tr>
      <td>backgroundColor</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;#EBEBEB&quot;</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>未选择的进度条的颜色</td>
    </tr>
    <tr>
      <td>active</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>进度条从左往右的动画</td>
    </tr>
    <tr>
      <td>activeMode</td>
      <td><code>&quot;backwards&quot; | &quot;forwards&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>backwards</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>backwards: 动画从头播<br /><br />forwards: 动画从上次结束点接着播</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>30</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>进度增加 1% 所需毫秒数</td>
    </tr>
    <tr>
      <td>onActiveEnd</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>动画完成事件</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
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

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Progress | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
