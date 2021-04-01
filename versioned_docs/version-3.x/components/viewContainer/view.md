---
title: View
sidebar_label: View
---

视图容器

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/view.html)

## 类型

```tsx
ComponentType<ViewProps>
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
        <Text>flex-direction: row 横向布局</Text>
        <View className='flex-wrp' style='flex-direction:row;'>
          <View className='flex-item demo-text-1'/>
          <View className='flex-item demo-text-2'/>
          <View className='flex-item demo-text-3'/>
        </View>
        <Text>flex-direction: column 纵向布局</Text>
        <View className='flex-wrp' style='flex-direction:column;'>
          <View className='flex-item flex-item-V demo-text-1'/>
          <View className='flex-item flex-item-V demo-text-2'/>
          <View className='flex-item flex-item-V demo-text-3'/>
        </View>
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
    <text>flex-direction: row 横向布局</text>
    <view class="flex-wrp flex-wrp-row" hoverClass="hover" >
      <view class="flex-item demo-text-1" hoverStopPropagation="true" />
      <view class="flex-item demo-text-2" hoverStartTime="1000" hoverClass="hover" />
      <view class="flex-item demo-text-3" hoverStayTime="1000" hoverClass="hover" />
    </view>
    <text>flex-direction: column 纵向布局</text>
    <view class="flex-wrp flex-wrp-column">
      <view class="flex-item flex-item-V demo-text-1" />
      <view class="flex-item flex-item-V demo-text-2" />
      <view class="flex-item flex-item-V demo-text-3" />
    </view>
  </view>
</template>

<style>
.flex-wrp { display: flex; }
.flex-wrp-column{ flex-direction: column; }
.flex-wrp-row { flex-direction:row; padding: 20px; background: #f1f1f1; }
.flex-item { width: 180px; height: 90px; }
.demo-text-1 { background: #ccc; }
.demo-text-2 { background: #999; }
.demo-text-3 { background: #666; }
.hover {
  background: #000;
}
</style>
```

</TabItem>
</Tabs>

## ViewProps

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
      <td>hoverClass</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>none</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>指定按下去的样式类。当 <code>hover-class=&quot;none&quot;</code> 时，没有点击态效果</td>
    </tr>
    <tr>
      <td>hoverStyle</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>none</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>由于 RN 不支持 Class，故 RN 端的 View 组件实现了 <code>hoverStyle</code>属性，写法和 style 类似，只不过 <code>hoverStyle</code> 的样式是指定按下去的样式。</td>
    </tr>
    <tr>
      <td>hoverStopPropagation</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>fasle</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>指定是否阻止本节点的祖先节点出现点击态</td>
    </tr>
    <tr>
      <td>hoverStartTime</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>50</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>按住后多久出现点击态，单位毫秒</td>
    </tr>
    <tr>
      <td>hoverStayTime</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>400</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>手指松开后点击态保留时间，单位毫秒</td>
    </tr>
    <tr>
      <td>catchMove</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>阻止滚动穿透</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| ViewProps.hoverClass | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | (由于 RN 不支持 Class，故 RN 端的 View 组件实现了 `hoverStyle`属性，写法和 style 类似，只不过 `hoverStyle` 的样式是指定按下去的样式。) |
| ViewProps.hoverStyle |  |  |  |  |  | ✔️ |
| ViewProps.hoverStopPropagation | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
| ViewProps.hoverStartTime | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ViewProps.hoverStayTime | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| View | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
