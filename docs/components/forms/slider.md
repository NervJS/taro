---
title: Slider
sidebar_label: Slider
---

滑动选择器

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/slider.html)

## 类型

```tsx
ComponentType<SliderProps>
```

## 示例代码

```tsx
export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <View className='components-page'>
        <Text>设置 step</Text>
        <Slider step={1} value={50}/>
        <Text>显示当前 value</Text>
        <Slider step={1} value={50} showValue/>
        <Text>设置最小/最大值</Text>
        <Slider step={1} value={100} showValue min={50} max={200}/>
      </View>
    )
  }
}
```

## SliderProps

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">默认值</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>min</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>0</code></td>
      <td style="text-align:center">否</td>
      <td>最小值</td>
    </tr>
    <tr>
      <td>max</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>100</code></td>
      <td style="text-align:center">否</td>
      <td>最大值</td>
    </tr>
    <tr>
      <td>step</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>1</code></td>
      <td style="text-align:center">否</td>
      <td>步长，取值必须大于 0，并且可被(max - min)整除</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否禁用</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>0</code></td>
      <td style="text-align:center">否</td>
      <td>当前取值</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;#e9e9e9&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>背景条的颜色（请使用 backgroundColor）</td>
    </tr>
    <tr>
      <td>selectedColor</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;#1aad19&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>已选择的颜色（请使用 activeColor）</td>
    </tr>
    <tr>
      <td>activeColor</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;#1aad19&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>已选择的颜色</td>
    </tr>
    <tr>
      <td>backgroundColor</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;#e9e9e9&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>背景条的颜色</td>
    </tr>
    <tr>
      <td>blockSize</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>28</code></td>
      <td style="text-align:center">否</td>
      <td>滑块的大小，取值范围为 12 - 28</td>
    </tr>
    <tr>
      <td>blockColor</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;#ffffff&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>滑块的颜色</td>
    </tr>
    <tr>
      <td>showValue</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否显示当前 value</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>完成一次拖动后触发的事件</td>
    </tr>
    <tr>
      <td>onChanging</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>拖动过程中触发的事件</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| SliderProps.min | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SliderProps.max | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SliderProps.step | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SliderProps.disabled | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SliderProps.value | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SliderProps.color | ✔️ |  |  | ✔️ |  |  |
| SliderProps.selectedColor | ✔️ |  |  | ✔️ |  |  |
| SliderProps.activeColor | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SliderProps.backgroundColor | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SliderProps.blockSize | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
| SliderProps.blockColor | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SliderProps.showValue | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SliderProps.onChange | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SliderProps.onChanging | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

### onChangeEventDetail

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Slider | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
