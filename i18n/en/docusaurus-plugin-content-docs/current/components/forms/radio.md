---
title: Radio
sidebar_label: Radio
---

Single-select item.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/radio.html)

## Type

```tsx
ComponentType<RadioProps>
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
export default class PageRadio extends Component {
  state = {
    list: [
      {
        value: 'USA',
        text: 'United States',
        checked: false
      },
      {
        value: 'CHN',
        text: 'China',
        checked: true
      },
      {
        value: 'BRA',
        text: 'Brazil',
        checked: false
      },
      {
        value: 'JPN',
        text: 'Japan',
        checked: false
      },
      {
        value: 'ENG',
        text: 'United Kingdom',
        checked: false
      },
      {
        value: 'TUR',
        text: 'France',
        checked: false
      }
    ]
  }
  render () {
    return (
      <View className='container'>
        <Head title='Radio' />
        <View className='page-body'>
          <View className='page-section'>
            <Text>default style</Text>
            <Radio value='selected' checked>Selected</Radio>
            <Radio style='margin-left: 20rpx' value='not-selected'>Not Selected</Radio>
          </View>
          <View className='page-section'>
            <Text>recommend style</Text>
            <View className='radio-list'>
              <RadioGroup>
                {this.state.list.map((item, i) => {
                  return (
                    <Label className='radio-list__label' for={i} key={i}>
                      <Radio className='radio-list__radio' value={item.value} checked={item.checked}>{item.text}</Radio>
                    </Label>
                  )
                })}
              </RadioGroup>
            </View>
          </View>
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
      <radio value="selected" :checked="true">Selected</radio>
      <radio style="margin-left: 20rpx;" value="not-selected">Not Selected</radio>
    </view>
    <view class="page-section">
      <text>recommend style(Taro Contributors):</text>
        <radio-group @change="onChange">
          <label v-for="item in list" class="checkbox-list__label">
            <radio class="checkbox-list__checkbox" :value="item.value" :checked="item.checked">{{ item.text }}</radio>
          </label>
        </radio-group>
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
          checked: false
        },
        {
          value: 'xiexiaoli',
          text: 'xiexiaoli',
          checked: false
        },
        {
          value: 'honly',
          text: 'honly',
          checked: false
        },
        {
          value: 'cs',
          text: 'cs',
          checked: false
        },
        {
          value: 'zhutianjian',
          text: 'zhutianjian',
          checked: false
        },
        {
          value: '隔壁老李',
          text: '隔壁老李',
          checked: true
        }
      ]
    }
  },
  methods: {
    onChange: function(e) {
      console.log(e.detail.value)
    }
  }
}
</script>
```
  
</TabItem>
</Tabs>

## RadioProps

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
      <td style={{ textAlign: "center"}}>No</td>
      <td>The ID of the `radio` component. When this `radio` is selected, the change event for `radio-group` will carry the value of `radio`.</td>
    </tr>
    <tr>
      <td>checked</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to select the checkbox.</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to disable the component.</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;#09BB07&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The color of the radio. It is the same as the color of the css.</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RadioProps.value | ✔️ |  | ✔️ |
| RadioProps.checked | ✔️ | ✔️ | ✔️ |
| RadioProps.disabled | ✔️ | ✔️ | ✔️ |
| RadioProps.color | ✔️ |  | ✔️ |

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Radio | ✔️ | ✔️ | ✔️ |
