---
title: Picker
sidebar_label: Picker
---

从底部弹起的滚动选择器

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/picker.html)

## 类型

```tsx
ComponentType<PickerSelectorProps | PickerMultiSelectorProps | PickerTimeProps | PickerDateProps | PickerRegionProps>
```

## 示例代码

```tsx
export default class PagePicker extends Component {
  state = {
    selector: ['美国', '中国', '巴西', '日本'],
    selectorChecked: '美国',
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
            <Text>地区选择器</Text>
            <View>
              <Picker mode='selector' range={this.state.selector} onChange={this.onChange}>
                <View className='picker'>
                  当前选择：{this.state.selectorChecked}
                </View>
              </Picker>
            </View>
          </View>
          <View className='page-section'>
            <Text>时间选择器</Text>
            <View>
              <Picker mode='time' onChange={this.onTimeChange}>
                <View className='picker'>
                  当前选择：{this.state.timeSel}
                </View>
              </Picker>
            </View>
          </View>
          <View className='page-section'>
            <Text>日期选择器</Text>
            <View>
              <Picker mode='date' onChange={this.onDateChange}>
                <View className='picker'>
                  当前选择：{this.state.dateSel}
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

## PickerStandardProps

选择器通用参数

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
      <td>mode</td>
      <td><code>&quot;selector&quot; | &quot;multiSelector&quot; | &quot;time&quot; | &quot;date&quot; | &quot;region&quot;</code></td>
      <td style="text-align:center"><code>&quot;selector&quot;</code></td>
      <td style="text-align:center">是</td>
      <td>选择器类型，默认是普通选择器</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否禁用</td>
    </tr>
    <tr>
      <td>onCancel</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>取消选择或点遮罩层收起 picker 时触发</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PickerStandardProps.mode | ✔️ | ✔️ | ✔️ |
| PickerStandardProps.disabled | ✔️ | ✔️ | ✔️ |
| PickerStandardProps.onCancel | ✔️ | ✔️ | ✔️ |

### mode

选择器类型

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>selector</td>
      <td>普通选择器</td>
    </tr>
    <tr>
      <td>multiSelector</td>
      <td>多列选择器</td>
    </tr>
    <tr>
      <td>time</td>
      <td>时间选择器</td>
    </tr>
    <tr>
      <td>date</td>
      <td>日期选择器</td>
    </tr>
    <tr>
      <td>region</td>
      <td>省市区选择器</td>
    </tr>
  </tbody>
</table>

## PickerSelectorProps

普通选择器：mode = selector

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
      <td>mode</td>
      <td><code>&quot;selector&quot;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>选择器类型</td>
    </tr>
    <tr>
      <td>range</td>
      <td><code>string[] | number[] | Object[]</code></td>
      <td style="text-align:center"><code>[]</code></td>
      <td style="text-align:center">是</td>
      <td>mode为 selector 或 multiSelector 时，range 有效</td>
    </tr>
    <tr>
      <td>rangeKey</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当 range 是一个 Object Array 时，通过 rangeKey 来指定 Object 中 key 的值作为选择器显示内容</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>0</code></td>
      <td style="text-align:center">是</td>
      <td>表示选择了 range 中的第几个（下标从 0 开始）</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>value 改变时触发 change 事件，event.detail = {value}</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PickerSelectorProps.range | ✔️ | ✔️ | ✔️ |
| PickerSelectorProps.rangeKey | ✔️ | ✔️ | ✔️ |
| PickerSelectorProps.value | ✔️ | ✔️ | ✔️ |
| PickerSelectorProps.onChange | ✔️ | ✔️ | ✔️ |

### onChangeEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>string | number</code></td>
      <td>表示变更值的下标</td>
    </tr>
  </tbody>
</table>

## PickerMultiSelectorProps

多列选择器：mode = multiSelector

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
      <td>mode</td>
      <td><code>&quot;multiSelector&quot;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>选择器类型</td>
    </tr>
    <tr>
      <td>range</td>
      <td><code>string[][] | number[][] | Object[][]</code></td>
      <td style="text-align:center"><code>[]</code></td>
      <td style="text-align:center">是</td>
      <td>mode为 selector 或 multiSelector 时，range 有效</td>
    </tr>
    <tr>
      <td>rangeKey</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当 range 是一个 Object Array 时，通过 rangeKey 来指定 Object 中 key 的值作为选择器显示内容</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>string[] | number[] | Object[]</code></td>
      <td style="text-align:center"><code>[]</code></td>
      <td style="text-align:center">是</td>
      <td>表示选择了 range 中的第几个（下标从 0 开始）</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>当 value 改变时触发 change 事件，event.detail = {value}</td>
    </tr>
    <tr>
      <td>onColumnChange</td>
      <td><code>BaseEventOrigFunction&lt;onColumnChangeEvnetDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>列改变时触发</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
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
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>number[]</code></td>
      <td>表示变更值的下标</td>
    </tr>
  </tbody>
</table>

### onColumnChangeEvnetDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>column</td>
      <td><code>number</code></td>
      <td>表示改变了第几列（下标从0开始）</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>number</code></td>
      <td>表示变更值的下标</td>
    </tr>
  </tbody>
</table>

## PickerTimeProps

时间选择器：mode = time

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
      <td>mode</td>
      <td><code>&quot;time&quot;</code></td>
      <td style="text-align:center">是</td>
      <td>选择器类型</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>value 的值表示选择了 range 中的第几个（下标从 0 开始）</td>
    </tr>
    <tr>
      <td>start</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>仅当 mode = time</td>
    </tr>
    <tr>
      <td>end</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>仅当 mode = time</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDetail&gt;</code></td>
      <td style="text-align:center">是</td>
      <td>value 改变时触发 change 事件，event.detail = {value}</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PickerTimeProps.value | ✔️ | ✔️ | ✔️ |
| PickerTimeProps.start | ✔️ | ✔️ | ✔️ |
| PickerTimeProps.end | ✔️ | ✔️ | ✔️ |
| PickerTimeProps.onChange | ✔️ | ✔️ | ✔️ |

### onChangeEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>string</code></td>
      <td>表示选中的时间</td>
    </tr>
  </tbody>
</table>

## PickerDateProps

日期选择器：mode = date

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
      <td>mode</td>
      <td><code>&quot;date&quot;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>选择器类型</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>0</code></td>
      <td style="text-align:center">是</td>
      <td>表示选中的日期，格式为&quot;YYYY-MM-DD&quot;</td>
    </tr>
    <tr>
      <td>start</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>仅当 mode = time</td>
    </tr>
    <tr>
      <td>end</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>仅当 mode = time</td>
    </tr>
    <tr>
      <td>fields</td>
      <td><code>&quot;year&quot; | &quot;month&quot; | &quot;day&quot;</code></td>
      <td style="text-align:center"><code>&quot;day&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>有效值 year, month, day，表示选择器的粒度</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>value 改变时触发 change 事件，event.detail = {value}</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PickerDateProps.value | ✔️ | ✔️ | ✔️ |
| PickerDateProps.start | ✔️ | ✔️ | ✔️ |
| PickerDateProps.end | ✔️ | ✔️ | ✔️ |
| PickerDateProps.fields | ✔️ | ✔️ | ✔️ |
| PickerDateProps.onChange | ✔️ | ✔️ | ✔️ |

### fields

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>year</td>
      <td>选择器粒度为年</td>
    </tr>
    <tr>
      <td>month</td>
      <td>选择器粒度为月份</td>
    </tr>
    <tr>
      <td>day</td>
      <td>选择器粒度为天</td>
    </tr>
  </tbody>
</table>

### onChangeEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>string</code></td>
      <td>表示选中的日期</td>
    </tr>
  </tbody>
</table>

## PickerRegionProps

省市区选择器：mode = region

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
      <td>mode</td>
      <td><code>&quot;region&quot;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>选择器类型</td>
    </tr>
    <tr>
      <td>value</td>
      <td><code>string[]</code></td>
      <td style="text-align:center"><code>[]</code></td>
      <td style="text-align:center">是</td>
      <td>表示选中的省市区，默认选中每一列的第一个值</td>
    </tr>
    <tr>
      <td>customItem</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>可为每一列的顶部添加一个自定义的项</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>value 改变时触发 change 事件，event.detail = {value, code, postcode}，其中字段 code 是统计用区划代码，postcode 是邮政编码</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PickerRegionProps.value | ✔️ | ✔️ | ✔️ |
| PickerRegionProps.customItem | ✔️ | ✔️ | ✔️ |
| PickerRegionProps.onChange | ✔️ | ✔️ | ✔️ |

### onChangeEventDetail

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
      <td>value</td>
      <td><code>string[]</code></td>
      <td style="text-align:center">是</td>
      <td>表示选中的省市区</td>
    </tr>
    <tr>
      <td>code</td>
      <td><code>string[]</code></td>
      <td style="text-align:center">是</td>
      <td>统计用区划代码</td>
    </tr>
    <tr>
      <td>postcode</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>邮政编码</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Picker | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
