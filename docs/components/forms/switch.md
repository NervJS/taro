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
      <td>checked</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否选中</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否禁用</td>
    </tr>
    <tr>
      <td>type</td>
      <td><code>&quot;switch&quot; | &quot;checkbox&quot;</code></td>
      <td style="text-align:center"><code>&quot;switch&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>样式，有效值：switch, checkbox</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;#04BE02&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>switch 的颜色，同 css 的 color</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>checked 改变时触发 change 事件</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| SwitchProps.checked | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwitchProps.disabled | ✔️ |  |  |  |  |  |
| SwitchProps.type | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwitchProps.color | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwitchProps.onChange | ✔️ |  |  |  |  |  |

### onChangeEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>boolean</code></td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Switch | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
