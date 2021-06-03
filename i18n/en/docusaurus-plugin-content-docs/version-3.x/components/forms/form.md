---
title: Form
sidebar_label: Form
---

Form. It is used to submit the switch, input, checkbox, slider, radio, and picker that are entered by the user in the component.

In the form, when the button component in which form-type is set to submit is tapped, the value in the form component will be submitted. You need to add name to the form component as the key.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/form.html)

## Type

```tsx
ComponentType<FormProps>
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

</TabItem>

<TabItem value="Vue">

```html
<template>
  <form @submit="formSubmit" @reset="formReset" >
      <view class="taro-example-body">
        <switch name="switch" class="form-switch"></Switch>
      </view>
      <view class="taro-example-btns">
        <button form-type="submit">Submit</button>
        <button type="default" form-type="reset">Reset</button>
    </view>
  </form>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    formSubmit (e) {
      console.log(e)
    },

    formReset (e) {
      console.log(e)
    }
  }
}
</script>

```
  
</TabItem>
</Tabs>



## FormProps

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
      <td>reportSubmit</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to return the formId for sending a Message Template.</td>
    </tr>
    <tr>
      <td>reportSubmitTimeout</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>0</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Duration (in ms) before confirmation on whether the formId takes effect timed out. If this parameter is not specified, there is a low probability (for example, in case of network failure) that the formId does not take effect. Specifying this parameter allows you to detect whether the formId takes effect before timeout. If failed, a formId prefixed with requestFormId:fail is returned.</td>
    </tr>
    <tr>
      <td>onSubmit</td>
      <td><code>BaseEventOrigFunction&lt;onSubmitEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggers a submit event that carries the form data.<br />event.detail = {`{ value : { name': 'value'}, formId: '' }`}</td>
    </tr>
    <tr>
      <td>onReset</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggers a submit event that carries the form data.</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| FormProps.reportSubmit | ✔️ | ✔️ |  |
| FormProps.reportSubmitTimeout | ✔️ |  |  |
| FormProps.onSubmit | ✔️ |  | ✔️ |
| FormProps.onReset | ✔️ | ✔️ | ✔️ |

### onSubmitEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>{`{ [formItemName: string]: any; }`}</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>When the <code>&lt;button&gt;</code> component of a <code>&lt;form&gt;</code> form with a <code>form-type</code> of submit is clicked,  the the <code>value</code> in the form component is submitted. <br />You need to add <code>name</code> as the <code>key</code> in the form component.
      </td>
    </tr>
    <tr>
      <td>formId</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>When <code>reportSubmit</code> is <code>true</code>, returns <code>formId</code> for sending template messages.</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Form | ✔️ | ✔️ | ✔️ |
