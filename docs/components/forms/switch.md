---
title: Switch
sidebar_label: Switch
---

开关选择器

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/switch.html)

## 类型

```tsx
ComponentType<SwitchProps>
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
        <Text>默认样式</Text>
        <Switch checked/>
        <Switch/>
        <Text>推荐展示样式</Text>
        <Switch checked/>
        <Switch/>
      </View>
    )
  }
}
```

## SwitchProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| checked | `boolean` | `false` | 否 | 是否选中 |
| disabled | `boolean` | `false` | 否 | 是否禁用 |
| type | "switch" or "checkbox" | `"switch"` | 否 | 样式，有效值：switch, checkbox |
| color | `string` | `"#04BE02"` | 否 | switch 的颜色，同 css 的 color |
| onChange | `BaseEventOrigFunction<onChangeEventDetail>` |  | 否 | checked 改变时触发 change 事件 |

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| SwitchProps.checked | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwitchProps.disabled | ✔️ |  |  |  |  |  |
| SwitchProps.type | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwitchProps.color | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwitchProps.onChange | ✔️ |  |  |  |  |  |

### onChangeEventDetail

| 参数 | 类型 |
| --- | --- |
| value | `boolean` |

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Switch | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
