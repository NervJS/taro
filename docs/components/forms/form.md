##### Form
##### 表单，将组件内的用户输入的值提交。当点击 表单中 formType 为 submit 的 button 组件时，会将表单组件中的 value 值进行提交，需要在表单组件中加上 name 来作为 key

> 属性及支持度

| 微信小程序 | H5 | ReactNative | 属性值 | 类型 | 说明 |
| :-: | :-: | :-: | :-: |:-: | :-: | :-: |
| √ | x | x | reportSubmit | Boolean | 是否返回 formId 用于发送模板消息 |
| √ | √ | √ | onSubmit | EventHandle | 携带 form 中的数据触发 submit 事件，event.detail = {value : {'name': 'value'}} |
| √ | √ | x | onReset | EventHandle | 表单重置时会触发 reset 事件 |
