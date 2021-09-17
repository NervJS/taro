---
title: CheckboxGroup
sidebar_label: CheckboxGroup
---

Multi-item picker, consisting of multiple checkbox components.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/checkbox-group.html)

## Type

```tsx
ComponentType<CheckboxGroupProps>
```

## Examples

```tsx
export default class PageCheckbox extends Component {
  state = {
    list: [
      {
        value: 'A',
        text: 'A',
        checked: false
      },
      {
        value: 'B',
        text: 'B',
        checked: true
      },
      {
        value: 'C',
        text: 'C',
        checked: false
      },
      {
        value: 'D',
        text: 'D',
        checked: false
      },
      {
        value: 'E',
        text: 'E',
        checked: false
      },
      {
        value: 'F',
        text: 'E',
        checked: false
      }
    ]
  }
  render () {
    return (
      <View className='page-body'>
        <View className='page-section'>
          <Text>default style</Text>
          <Checkbox value='selected' checked>Selected</Checkbox>
          <Checkbox style='margin-left: 20rpx' value='not-selected'>Not Selected</Checkbox>
        </View>
        <View className='page-section'>
          <Text>recommended style</Text>
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
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>name</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The name is added to the form component as a key</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;{`{ value: string[]; }`}&gt;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The change event is triggered when the selected item in <code>&lt;CheckboxGroup/&gt;</code>is changed.<br /><br />event.detail = {`{ value: [An array of the values of the selected checkboxes.] }`}</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CheckboxGroupProps.name |  | ✔️ |  |
| CheckboxGroupProps.onChange | ✔️ | ✔️ | ✔️ |

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CheckboxGroup | ✔️ | ✔️ | ✔️ |
