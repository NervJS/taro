---
title: CheckboxGroup
sidebar_label: CheckboxGroup
id: version-2.1.1-checkbox-group
original_id: checkbox-group
---

多项选择器，内部由多个checkbox组成

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/checkbox-group.html)

## 类型

```tsx
ComponentType<CheckboxGroupProps>
```

## 示例代码

```tsx
export default class PageCheckbox extends Component {
  state = {
    list: [
      {
        value: '美国',
        text: '美国',
        checked: false
      },
      {
        value: '中国',
        text: '中国',
        checked: true
      },
      {
        value: '巴西',
        text: '巴西',
        checked: false
      },
      {
        value: '日本',
        text: '日本',
        checked: false
      },
      {
        value: '英国',
        text: '英国',
        checked: false
      },
      {
        value: '法国',
        text: '法国',
        checked: false
      }
    ]
  }
  render () {
    return (
      <View className='page-body'>
        <View className='page-section'>
          <Text>默认样式</Text>
          <Checkbox value='选中' checked>选中</Checkbox>
          <Checkbox style='margin-left: 20rpx' value='未选中'>未选中</Checkbox>
        </View>
        <View className='page-section'>
          <Text>推荐展示样式</Text>
          {this.state.list.map((item, i) => {
            return (
              <Label className='checkbox-list__label' for={i} key={i}>
                <Checkbox className='checkbox-list__checkbox' value={item.value} checked={item.checked}>{item.text}</Checkbox>
              </Label>
            )
          })}
        </View>
      </View>
    )
  }
}
```

## CheckboxGroupProps

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
      <td>name</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>表单组件中加上 name 来作为 key</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;{ value: string[]; }&gt;</code></td>
      <td style="text-align:center">否</td>
      <td><code>&lt;CheckboxGroup/&gt;</code> 中选中项发生改变是触发 change 事件<br /><br />event.detail = { value: [选中的checkbox的 value 的数组] }</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CheckboxGroupProps.name |  | ✔️ |  |
| CheckboxGroupProps.onChange | ✔️ | ✔️ | ✔️ |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CheckboxGroup | ✔️ | ✔️ | ✔️ |
