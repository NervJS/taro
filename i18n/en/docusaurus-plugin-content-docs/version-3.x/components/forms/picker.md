---
title: Picker
sidebar_label: Picker
---

The scroll picker that pops up from the lower part.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/picker.html)

## Type

```tsx
ComponentType<PickerSelectorProps | PickerMultiSelectorProps | PickerTimeProps | PickerDateProps | PickerRegionProps>
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
export default class PagePicker extends Component {
  state = {
    selector: ['United States', 'China', 'Brazil', 'Japan'],
    selectorChecked: 'United States',
    timeSel: '12:01',
    dateSel: '2018-04-22'
  }

  onChange = e => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value]
    })
  }

  onTimeChange = e => {
    this.setState({
      timeSel: e.detail.value
    })
  }
  onDateChange = e => {
    this.setState({
      dateSel: e.detail.value
    })
  }

  render () {
    return (
      <View className='container'>
        <View className='page-body'>
          <View className='page-section'>
            <Text>Province, city, and district picker</Text>
            <View>
              <Picker mode='selector' range={this.state.selector} onChange={this.onChange}>
                <View className='picker'>
                  Currently selected: {this.state.selectorChecked}
                </View>
              </Picker>
            </View>
          </View>
          <View className='page-section'>
            <Text>Time picker</Text>
            <View>
              <Picker mode='time' onChange={this.onTimeChange}>
                <View className='picker'>
                  Currently selected: {this.state.timeSel}
                </View>
              </Picker>
            </View>
          </View>
          <View className='page-section'>
            <Text>Date picker</Text>
            <View>
              <Picker mode='date' onChange={this.onDateChange}>
                <View className='picker'>
                  Currently selected: {this.state.dateSel}
                </View>
              </Picker>
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
  <view class="page-body">
    <view class="page-section">
      <text>Province, city, and district picker</text>
      <view>
        <picker mode="selector" :range="selector" @change="onChange">
          <view class="picker">
            Currently selected: {{selectorChecked}}
          </view>
        </picker>
      </view>
    </view>
    <view class="page-section">
      <text>Time picker</text>
      <view>
        <picker mode="time" @change="onTimeChange">
          <view class="picker">
            Currently selected: {{timeSel}}
          </view>
        </picker>
      </view>
    </view>
    <view class="page-section">
      <text>Date picker</text>
      <view>
        <picker mode="date" @change="onDateChange">
          <view class="picker">
            Currently selected: {{dateSel}}
          </view>
        </picker>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        selector: ['United States', 'China', 'Brazil', 'Japan'],
        selectorChecked: 'United States',
        timeSel: '12:01',
        dateSel: '2018-04-22'
      }
    },
    methods: {
      onChange: function(e) {
        this.selectorChecked = this.selector[e.detail.value]
      },

      onTimeChange: function(e) {
        this.timeSel = e.detail.value
      },

      onDateChange: function(e) {
        this.dateSel = e.detail.value
      }
    }
  }
</script>

```
  
</TabItem>
</Tabs>

## PickerStandardProps

Selector General Parameters

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
      <td>mode</td>
      <td><code>&quot;selector&quot; | &quot;multiSelector&quot; | &quot;time&quot; | &quot;date&quot; | &quot;region&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;selector&quot;</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The type of the picker</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to disable the component.</td>
    </tr>
    <tr>
      <td>onCancel</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when selection is canceled</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PickerStandardProps.mode | ✔️ | ✔️ | ✔️ |
| PickerStandardProps.disabled | ✔️ | ✔️ | ✔️ |
| PickerStandardProps.onCancel | ✔️ | ✔️ | ✔️ |

### mode

Valid values of mode

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>selector</td>
      <td>Common picker</td>
    </tr>
    <tr>
      <td>multiSelector</td>
      <td>Multi-column picker</td>
    </tr>
    <tr>
      <td>time</td>
      <td>Time picker</td>
    </tr>
    <tr>
      <td>date</td>
      <td>Date picker</td>
    </tr>
    <tr>
      <td>region</td>
      <td>Province, city, and district picker</td>
    </tr>
  </tbody>
</table>

## PickerSelectorProps

Common picker: mode = selector

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
      <td>mode</td>
      <td><code>&quot;selector&quot;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The type of the picker</td>
    </tr>
    <tr>
      <td>range</td>
      <td><code>string[] | number[] | Object[]</code></td>
      <td style={{ textAlign: "center"}}><code>[]</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Valid when the mode is selector or multiSelector.</td>
    </tr>
    <tr>
      <td>rangeKey</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the key value of the object as the content to be displayed on the picker when range is an object array.</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>0</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Indicates the sequence number (starting from 0 in the subscript) of the item selected in range.</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>A change event is triggered when value is changed. event.detail = {`{value}`}</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PickerSelectorProps.range | ✔️ | ✔️ | ✔️ |
| PickerSelectorProps.rangeKey | ✔️ | ✔️ | ✔️ |
| PickerSelectorProps.value | ✔️ | ✔️ | ✔️ |
| PickerSelectorProps.onChange | ✔️ | ✔️ | ✔️ |

### onChangeEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>string | number</code></td>
      <td>Indicates the subscript of the changed value</td>
    </tr>
  </tbody>
</table>

## PickerMultiSelectorProps

Multi-column picker: mode = multiSelector

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
      <td>mode</td>
      <td><code>&quot;multiSelector&quot;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The type of the picker</td>
    </tr>
    <tr>
      <td>range</td>
      <td><code>string[][] | number[][] | Object[][]</code></td>
      <td style={{ textAlign: "center"}}><code>[]</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Valid when the mode is selector or multiSelector.</td>
    </tr>
    <tr>
      <td>rangeKey</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the key value of the object as the content to be displayed on the picker when range is an object array.</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>string[] | number[] | Object[]</code></td>
      <td style={{ textAlign: "center"}}><code>[]</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Indicates the sequence number (starting from 0 in the subscript) of the item selected in range.</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>A change event is triggered when value is changed. event.detail = {`{value}`}</td>
    </tr>
    <tr>
      <td>onColumnChange</td>
      <td><code>BaseEventOrigFunction&lt;onColumnChangeEvnetDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the column changes.</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PickerMultiSelectorProps.range | ✔️ | ✔️ | ✔️ |
| PickerMultiSelectorProps.rangeKey | ✔️ | ✔️ | ✔️ |
| PickerMultiSelectorProps.value | ✔️ | ✔️ | ✔️ |
| PickerMultiSelectorProps.onChange | ✔️ | ✔️ | ✔️ |
| PickerMultiSelectorProps.onColumnChange | ✔️ | ✔️ | ✔️ |

### onChangeEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>number[]</code></td>
      <td>Indicates the subscript of the changed value</td>
    </tr>
  </tbody>
</table>

### onColumnChangeEvnetDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>column</td>
      <td><code>number</code></td>
      <td>Indicates which column was changed (subscripts start from 0)</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>number</code></td>
      <td>Indicates the subscript of the changed value</td>
    </tr>
  </tbody>
</table>

## PickerTimeProps

Time picker: mode = time

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
      <td>mode</td>
      <td><code>&quot;time&quot;</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The type of the picker</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The selected time, in the form of "hh:mm".</td>
    </tr>
    <tr>
      <td>start</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The start of the valid time range, in the form of "hh:mm".</td>
    </tr>
    <tr>
      <td>end</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The end of the valid time range, in the form of "hh:mm".</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>A change event triggered when the value is changed. event.detail = {`{value}`}</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PickerTimeProps.value | ✔️ | ✔️ | ✔️ |
| PickerTimeProps.start | ✔️ | ✔️ | ✔️ |
| PickerTimeProps.end | ✔️ | ✔️ | ✔️ |
| PickerTimeProps.onChange | ✔️ | ✔️ | ✔️ |

### onChangeEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>string</code></td>
      <td>Indicates the selected time</td>
    </tr>
  </tbody>
</table>

## PickerDateProps

Date picker: mode = date

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
      <td>mode</td>
      <td><code>&quot;date&quot;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The type of the picker</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>0</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The selected date, in the form of "YYYY-MM-DD".	</td>
    </tr>
    <tr>
      <td>start</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The start of the valid date range, in the form of "YYYY-MM-DD".</td>
    </tr>
    <tr>
      <td>end</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The end of the valid date range, in the form of "YYYY-MM-DD".</td>
    </tr>
    <tr>
      <td>fields</td>
      <td><code>&quot;year&quot; | &quot;month&quot; | &quot;day&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;day&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The granularity of the picker. Valid values include "year", "month", and "day".</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>vA change event triggered when the value is changed. event.detail = {`{value}`}</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PickerDateProps.value | ✔️ | ✔️ | ✔️ |
| PickerDateProps.start | ✔️ | ✔️ | ✔️ |
| PickerDateProps.end | ✔️ | ✔️ | ✔️ |
| PickerDateProps.fields | ✔️ | ✔️ | ✔️ |
| PickerDateProps.onChange | ✔️ | ✔️ | ✔️ |

### fields

Valid values of fields

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>year</td>
      <td>The granularity of the picker is year.</td>
    </tr>
    <tr>
      <td>month</td>
      <td>The granularity of the picker is month.</td>
    </tr>
    <tr>
      <td>day</td>
      <td>The granularity of the picker is day.</td>
    </tr>
  </tbody>
</table>

### onChangeEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>string</code></td>
      <td>Indicates the selected date</td>
    </tr>
  </tbody>
</table>

## PickerRegionProps

Province, city, and district picker: mode = region

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
      <td>mode</td>
      <td><code>&quot;region&quot;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The type of the picker</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>string[]</code></td>
      <td style={{ textAlign: "center"}}><code>[]</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The selected province, city, and district. The first value in each column is selected by default.</td>
    </tr>
    <tr>
      <td>customItem</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies a custom item to be added to the top of each column.</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>A change event triggered when the value is changed, event.detail = {`{value, code, postcode}`}. The code field refers to the statistical zoning code, and the postcode field refers to the post code.</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PickerRegionProps.value | ✔️ | ✔️ | ✔️ |
| PickerRegionProps.customItem | ✔️ | ✔️ | ✔️ |
| PickerRegionProps.onChange | ✔️ | ✔️ | ✔️ |

### onChangeEventDetail

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
      <td>value</td>
      <td><code>string[]</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Indicates the selected province and city</td>
    </tr>
    <tr>
      <td>code</td>
      <td><code>string[]</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Zone Codes for Statistics</td>
    </tr>
    <tr>
      <td>postcode</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Postal Code</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Picker | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
