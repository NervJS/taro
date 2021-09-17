---
title: Checkbox
sidebar_label: Checkbox
---

Multi-select item.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/checkbox.html)

## Type

```tsx
ComponentType<CheckboxProps>
```

## Examples

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

<Tabs
  defaultValue="React"
  values={[
    {label: 'React', value: 'React'},
    {label: 'Vue', value: 'Vue'}
  ]}>
<TabItem value="React">

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
        text: 'F',
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
</TabItem>

<TabItem value="Vue">

```html
<template>
  <view class="container">
    <view class="page-section">
      <text>default style</text>
      <checkbox value="selected" :checked="true">Selected</checkbox>
      <checkbox style="margin-left: 20rpx;" value="not-selected">Not Selected</checkbox>
    </view>
    <view class="page-section">
      <text>recommended style</text>
      <label v-for="item in list" class="checkbox-list__label">
        <checkbox class="checkbox-list__checkbox" :value="item.value" :checked="item.checked">{{ item.text }}</checkbox>
      </label>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          value: 'yuche',
          text: 'yuche',
          checked: false
        },
        {
          value: 'cjj',
          text: 'cjj',
          checked: true
        },
        {
          value: 'xiexiaoli',
          text: 'xiexiaoli',
          checked: true
        },
        {
          value: 'honly',
          text: 'honly',
          checked: true
        },
        {
          value: 'cs',
          text: 'cs',
          checked: true
        },
        {
          value: 'zhutianjian',
          text: 'zhutianjian',
          checked: true
        },
        {
          value: '隔壁老李',
          text: '隔壁老李',
          checked: true
        }
      ]
    }
  }
}
</script>

```

</TabItem>
</Tabs>

## CheckboxProps


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
      <td>value</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The ID of the <code>&lt;checkbox/&gt;</code> component. When it is selected, a <code>&lt;checkbox-group/&gt;</code> change event is triggered, carrying the value of <code>&lt;checkbox/&gt;</code>.</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to disable the component.</td>
    </tr>
    <tr>
      <td>checked</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to select the checkbox by default.</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The color of the checkbox. It is the same as the color of the css.</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td>
        `BaseEventOrigFunction&lt;{`{ value: string[]; }`}&gt;
      </td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The change event is triggered when the selected item changes, except for mini-program.</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CheckboxProps.value | ✔️ |  | ✔️ |
| CheckboxProps.disabled | ✔️ | ✔️ | ✔️ |
| CheckboxProps.checked | ✔️ | ✔️ | ✔️ |
| CheckboxProps.color | ✔️ | ✔️ | ✔️ |
| CheckboxProps.onChange |  | ✔️ | ✔️ |

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Checkbox | ✔️ | ✔️ | ✔️ |
