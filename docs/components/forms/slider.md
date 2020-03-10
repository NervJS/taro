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

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| min | `number` | `0` | 否 | 最小值 |
| max | `number` | `100` | 否 | 最大值 |
| step | `number` | `1` | 否 | 步长，取值必须大于 0，并且可被(max - min)整除 |
| disabled | `boolean` | `false` | 否 | 是否禁用 |
| value | `number` | `0` | 否 | 当前取值 |
| color | `string` | `"#e9e9e9"` | 否 | 背景条的颜色（请使用 backgroundColor） |
| selectedColor | `string` | `"#1aad19"` | 否 | 已选择的颜色（请使用 activeColor） |
| activeColor | `string` | `"#1aad19"` | 否 | 已选择的颜色 |
| backgroundColor | `string` | `"#e9e9e9"` | 否 | 背景条的颜色 |
| blockSize | `number` | `28` | 否 | 滑块的大小，取值范围为 12 - 28 |
| blockColor | `string` | `"#ffffff"` | 否 | 滑块的颜色 |
| showValue | `boolean` | `false` | 否 | 是否显示当前 value |
| onChange | `BaseEventOrigFunction<onChangeEventDetail>` |  | 否 | 完成一次拖动后触发的事件 |
| onChanging | `BaseEventOrigFunction<onChangeEventDetail>` |  | 否 | 拖动过程中触发的事件 |

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
