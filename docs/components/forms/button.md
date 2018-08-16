##### Button
##### 按钮。

> 属性及支持度

| 微信小程序 | H5 | ReactNative| 属性名 | 类型 | 默认值 | 说明 |
| :-: | :-: | :-: | :- | :- | :- | :- |
| √ | √ | √ | type   | String  | default   | 按钮的样式类型  |
| √ | √ | √ | size   | String  | default   | 按钮的大小 px |
| √ | √ | √ | plain  | Boolean | false | 按钮是否镂空，背景色透明   |
| √ | √ | √ | disabled  | Boolean | false | 是否禁用   |
| √ | √ | √ | loading   | Boolean | false | 名称前是否带 loading 图标  |
| √ |   | x | formType | String  | | 用于 form 组件，点击分别会触发 form 组件的 submit/reset 事件   |
| √ |   | x | openType | String  | | 微信开放能力  |
| √ |   | x | appParameter   | String  | | 打开 APP 时，向 APP 传递的参数   |
| √ | √ | √ | hoverClass | String  | button-hover | 指定按钮按下去的样式类。当 hover-class="none" 时，没有点击态效果  |
| √ |   | x | hoverStopPropagation | Boolean | false | 指定是否阻止本节点的祖先节点出现点击态  |
| √ | √ | √ | hoverStartTime    | Number  | 20    | 按住后多久出现点击态，单位毫秒   |
| √ | √ | √ | hoverStayTime | Number  | 70    | 手指松开后点击态保留时间，单位毫秒   |
| √ |   | x | onGetUserInfo | Handler | | 用户点击该按钮时，会返回获取到的用户信息，从返回参数的 detail 中获取到的值同 wx.getUserInfo |
| √ |   | x | onGetPhoneNumber | Handler | | 获取用户手机号回调 |
| √ |   | x | lang   | String  | en    | 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。 |


###### 示例：
```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'

export default class PageButton extends Component {
    constructor() {
        super(...arguments)
    }

    state = {
        btn: [
            {
                text: '页面主操作 Normal',
                size: 'default',
                type: 'primary'
            },
            {
                text: '页面主操作 Loading',
                size: 'default',
                type: 'primary',
                loading: true,
            },
            {
                text: '页面主操作 Disabled',
                size: 'default',
                type: 'primary',
                disabled: true,
            },
            {
                text: '页面次要操作 Normal',
                size: 'default',
                type: 'default'
            },
            {
                text: '页面次要操作 Disabled',
                size: 'default',
                type: 'default',
                disabled: true,
            },
            {
                text: '警告类操作 Normal',
                size: 'default',
                type: 'warn'
            },
            {
                text: '警告类操作 Disabled',
                size: 'default',
                type: 'warn',
                disabled: true,
            },
        ]
    }
    render() {
        return (
            <View className="container">
                {this.state.btn.map(item => {
                    return (
                        <Button
                            size={item.size ? item.size : ''}
                            type={item.type ? item.type : ''}
                            loading={item.loading ? item.loading : false}
                            disabled={item.disabled ? item.disabled : false}
                        >
                            {item.text}
                        </Button>
                    )
                })}
                <Button className="btn-max-w" plain type="primary">按钮</Button>
                <Button className="btn-max-w" plain type="primary" disabled>不可点击的按钮</Button>
                <Button className="btn-max-w" plain >按钮</Button>
                <Button className="btn-max-w" plain disabled >按钮</Button>
                <Button size="mini" type="primary">按钮</Button>
                <Button size="mini" >按钮</Button>
                <Button size="mini" type="warn">按钮</Button>
            </View>
        )
    }
}
```
