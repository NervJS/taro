---
title: Form
sidebar_label: Form
id: version-2.1.1-form
original_id: form
---

表单。将组件内的用户输入的 switch input checkbox slider radio picker 提交。

当点击 form 表单中 form-type 为 submit 的 button 组件时，会将表单组件中的 value 值进行提交，需要在表单组件中加上 name 来作为 key。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/form.html)

## 类型

```tsx
ComponentType<FormProps>
```

## 示例代码

```tsx
class App extends Component {

  formSubmit = e => {
    console.log(e)
  }

  formReset = e => {
    console.log(e)
  }

  render () {
    return (
      <Form onSubmit={this.formSubmit} onReset={this.formReset} >
        <View className='example-body'>
          <Switch name='switch' className='form-switch'></Switch>
        </View>
      </Form>
    )
  }
}
```

## FormProps

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
      <td>reportSubmit</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否返回 <code>formId</code> 用于发送模板消息。</td>
    </tr>
    <tr>
      <td>reportSubmitTimeout</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>0</code></td>
      <td style="text-align:center">否</td>
      <td>等待一段时间（毫秒数）以确认 <code>formId</code> 是否生效。<br />如果未指定这个参数，<code>formId</code> 有很小的概率是无效的（如遇到网络失败的情况）。<br />指定这个参数将可以检测 <code>formId</code> 是否有效，<br />以这个参数的时间作为这项检测的超时时间。<br />如果失败，将返回 <code>requestFormId:fail</code> 开头的 <code>formId</code>。</td>
    </tr>
    <tr>
      <td>onSubmit</td>
      <td><code>BaseEventOrigFunction&lt;onSubmitEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>携带 form 中的数据触发 submit 事件<br />event.detail = { value : {'name': 'value'} , formId: '' }</td>
    </tr>
    <tr>
      <td>onReset</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>表单重置时会触发 reset 事件</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FormProps.reportSubmit | ✔️ | ✔️ |  |
| FormProps.reportSubmitTimeout | ✔️ |  |  |
| FormProps.onSubmit | ✔️ |  |  |
| FormProps.onReset | ✔️ | ✔️ | ✔️ |

### onSubmitEventDetail

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
      <td><code>{ [formItemName: string]: any; }</code></td>
      <td style="text-align:center">否</td>
      <td>当点击 <code>&lt;form&gt;</code> 表单中 <code>form-type</code> 为 <code>submit</code> 的 <code>&lt;button&gt;</code> 组件时，<br />会将表单组件中的 <code>value</code> 值进行提交，<br />需要在表单组件中加上 <code>name</code> 来作为 <code>key</code>。</td>
    </tr>
    <tr>
      <td>formId</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>当 <code>reportSubmit</code> 为 <code>true</code> 时，返回 <code>formId</code> 用于发送模板消息。</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Form | ✔️ | ✔️ | ✔️ |
