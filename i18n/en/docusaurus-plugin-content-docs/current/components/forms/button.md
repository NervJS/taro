---
title: Button
sidebar_label: Button
---

Button.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/button.html)

## Type

```tsx
ComponentType<ButtonProps>
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
export default class PageButton extends Component {
  state = {
    btn: [
      {
        text: 'Primary Normal',
        size: 'default',
        type: 'primary'
      },
      {
        text: 'Primary Loading',
        size: 'default',
        type: 'primary',
        loading: true,
      },
      {
        text: 'Primary Disabled',
        size: 'default',
        type: 'primary',
        disabled: true,
      },
      {
        text: 'Secondary Normal',
        size: 'default',
        type: 'default'
      },
      {
        text: 'Secondary Disabled',
        size: 'default',
        type: 'default',
        disabled: true,
      },
      {
        text: 'Wran Normal',
        size: 'default',
        type: 'warn'
      },
      {
        text: 'Wran Disabled',
        size: 'default',
        type: 'warn',
        disabled: true,
      }
    ]
  }
  render () {
    return (
      <View className='container'>
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
        <Button className='btn-max-w' plain type='primary'>button</Button>
        <Button className='btn-max-w' plain type='primary' disabled>disabled button</Button>
        <Button className='btn-max-w' plain >button</Button>
        <Button className='btn-max-w' plain disabled >button</Button>
        <Button size='mini' type='primary'>button</Button>
        <Button size='mini' >button</Button>
        <Button size='mini' type='warn'>button</Button>
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
    <button
      v-for="item in btn"
      :size="item.size ? item.size : ''"
      :type="item.type ? item.type : ''"
      :loading="item.loading ? item.loading : false"
      :disabled="item.disabled ? item.disabled : false"
    >
      {{ item.text }}
    </button>
    <button class="btn-max-w" :plain="true" type="primary">button</button>
    <button class="btn-max-w" :plain="true" type="primary" :disabled="true">disabled button</button>
    <button class="btn-max-w" :plain="true">button</button>
    <button class="btn-max-w" :plain="true" :disabled="true">button</button>
    <button size="mini" type="primary">button</button>
    <button size="mini" >button</button>
    <button size="mini" type="warn">button</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      btn: [
        {
          text: 'Primary Normal',
          size: 'default',
          type: 'primary'
        },
        {
          text: 'Primary Loading',
          size: 'default',
          type: 'primary',
          loading: true,
        },
        {
          text: 'Primary Disabled',
          size: 'default',
          type: 'primary',
          disabled: true,
        },
        {
          text: 'Secondary Normal',
          size: 'default',
          type: 'default'
        },
        {
          text: 'Secondary Disabled',
          size: 'default',
          type: 'default',
          disabled: true,
        },
        {
          text: 'Secondary Normal',
          size: 'default',
          type: 'warn'
        },
        {
          text: 'Secondary Disabled',
          size: 'default',
          type: 'warn',
          disabled: true,
        }
      ]
    }
  }
}
</script>
```
  
</TabItem>
</Tabs>

## ButtonProps

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
      <td>size</td>
      <td><code>&quot;default&quot; | &quot;mini&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>default</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The size of the button.</td>
    </tr>
    <tr>
      <td>type</td>
      <td><code>&quot;default&quot; | &quot;primary&quot; | &quot;warn&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>default</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The style class of the button.</td>
    </tr>
    <tr>
      <td>plain</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether the button is hollow with transparent background.</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to disable the component.</td>
    </tr>
    <tr>
      <td>loading</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether a loading icon exists before the name.</td>
    </tr>
    <tr>
      <td>formType</td>
      <td><code>&quot;submit&quot; | &quot;reset&quot;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Used in the <code>&lt;form/&gt;</code> component. When it is tapped, the submit and reset events of the <code>&lt;form/&gt;</code> component are separately triggered.</td>
    </tr>
    <tr>
      <td>openType</td>
      <td><code>&quot;contact&quot; | &quot;contactShare&quot; | &quot;share&quot; | &quot;getRealnameAuthInfo&quot; | &quot;getAuthorize&quot; | &quot;getPhoneNumber&quot; | &quot;getUserInfo&quot; | &quot;lifestyle&quot; | &quot;launchApp&quot; | &quot;openSetting&quot; | &quot;feedback&quot;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Open capability of WeChat</td>
    </tr>
    <tr>
      <td>hoverClass</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>button-hover</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The style class the button that is tapped. When <code>hover-class=&quot;none&quot;</code>, the tap state is not displayed.</td>
    </tr>
    <tr>
      <td>hoverStyle</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>none</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Since RN does not support Class, the Button component on the RN side implements the <code>hoverStyle</code> property, which is written similarly to style, except that the style of <code>hoverStyle</code> specifies the style to be pressed.</td>
    </tr>
    <tr>
      <td>hoverStopPropagation</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to block the tapped state from the ancestor node of this node.</td>
    </tr>
    <tr>
      <td>hoverStartTime</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>20</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the time elapsed after tapping but before the tapped state occurs. It is measured in milliseconds.</td>
    </tr>
    <tr>
      <td>hoverStayTime</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>70</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the duration when the tapped state retains after stopping tapping. It is measured in milliseconds.</td>
    </tr>
    <tr>
      <td>lang</td>
      <td><code>&quot;en&quot; | &quot;zh_CN&quot; | &quot;zh_TW&quot;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the language of the returned user information. zh_CN: Simplified Chinese; zh_TW: Traditional Chinese; en: English.<br /><br />Pre-requisites: <code>open-type=&quot;getUserInfo&quot;</code></td>
    </tr>
    <tr>
      <td>sessionFrom</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The source of the chat. It is valid when <code>open-type=&quot;contact&quot;</code></td>
    </tr>
    <tr>
      <td>sendMessageTitle</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>Current title</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The title of the message card in the chat. It is valid when <code>open-type=&quot;contact&quot;</code></td>
    </tr>
    <tr>
      <td>sendMessagePath</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>Current title</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The path of the Mini Program to which the message card in the chat is tapped to navigate. It is valid when <code>open-type=&quot;contact&quot;</code></td>
    </tr>
    <tr>
      <td>sendMessageImg</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>Screenshot</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The image of the message card in the chat. It is valid when <code>open-type=&quot;contact&quot;</code></td>
    </tr>
    <tr>
      <td>appParameter</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The parameter passed to the app when it is launched. It is valid when <code>open-type=&quot;launchApp&quot;</code></td>
    </tr>
    <tr>
      <td>scope</td>
      <td><code>&quot;userInfo&quot; | &quot;phoneNumber&quot;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Alipay Mini-Program scope. It is valid when <code>open-type=&quot;getAuthorize&quot;</code></td>
    </tr>
    <tr>
      <td>showMessageCard</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to display message cards in a chat. It is valid when <code>open-type=&quot;contact&quot;</code></td>
    </tr>
    <tr>
      <td>onGetUserInfo</td>
      <td><code>BaseEventOrigFunction&lt;onGetUserInfoEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>When a user taps this button, the user information obtained is returned. The detail data that is obtained via callback is consistent with that returned by <code>Taro.getUserInfo</code>.<br /><br />It is valid when <code>open-type=&quot;getUserInfo&quot;</code></td>
    </tr>
    <tr>
      <td>onGetAuthorize</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Callback used to get the authorization of Alipay member information.<br /><br />It is valid when <code>open-type=&quot;getAuthorize&quot;</code></td>
    </tr>
    <tr>
      <td>onContact</td>
      <td><code>BaseEventOrigFunction&lt;onContactEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Callback used to obtain customer messages. It is valid when <code>open-type=&quot;contact&quot;</code>.</td>
    </tr>
    <tr>
      <td>onGetPhoneNumber</td>
      <td><code>BaseEventOrigFunction&lt;onGetPhoneNumberEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Callback used to obtain the user's mobile number. <br /><br /> It is valid when <code>open-type=&quot;getphonenumber&quot;</code></td>
    </tr>
    <tr>
      <td>onGetRealnameAuthInfo</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Callback used to obtain the user's real name.<br /><br />It is valid when <code>open-type=&quot;getRealnameAuthInfo&quot;</code></td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Callback used when an error occurred while using open capability.<br /><br />It is valid when <code>open-type=&quot;launchApp&quot;</code></td>
    </tr>
    <tr>
      <td>onOpenSetting</td>
      <td><code>BaseEventOrigFunction&lt;onOpenSettingEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Callback used after the authorization setting page is opened.<br /><br />It is valid when <code>open-type=&quot;openSetting&quot;</code></td>
    </tr>
    <tr>
      <td>onLaunchapp</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Callback used after the app is launched.<br /><br />It is valid when <code>open-type=&quot;launchApp&quot;</code></td>
    </tr>
  </tbody>
</table>

### API Support

| API | WeChat Mini-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: |
| ButtonProps.size | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.type | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.plain | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.disabled | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.loading | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.formType | ✔️ |  |  |  |
| ButtonProps.openType | ✔️ |  |  |  |
| ButtonProps.hoverClass | ✔️ |  | ✔️ |  |
| ButtonProps.hoverStyle |  |  |  | ✔️ |
| ButtonProps.hoverStopPropagation | ✔️ |  |  |  |
| ButtonProps.hoverStartTime | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.hoverStayTime | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.lang | ✔️ |  |  |  |
| ButtonProps.sessionFrom | ✔️ |  |  |  |
| ButtonProps.sendMessageTitle | ✔️ |  |  |  |
| ButtonProps.sendMessagePath | ✔️ |  |  |  |
| ButtonProps.sendMessageImg | ✔️ |  |  |  |
| ButtonProps.appParameter | ✔️ |  |  |  |
| ButtonProps.scope | ✔️ |  |  |  |
| ButtonProps.onGetUserInfo | ✔️ |  |  |  |
| ButtonProps.onGetAuthorize |  | ✔️ |  |  |
| ButtonProps.onContact | ✔️ |  |  |  |
| ButtonProps.onGetPhoneNumber | ✔️ |  |  |  |
| ButtonProps.onGetRealnameAuthInfo | ✔️ |  |  |  |
| ButtonProps.onError | ✔️ |  |  |  |
| ButtonProps.onOpenSetting | ✔️ |  |  |  |
| ButtonProps.onLaunchapp | ✔️ |  |  |  |

### size

Valid values of size

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>default</td>
      <td>Default size</td>
    </tr>
    <tr>
      <td>mini</td>
      <td>Minimum size</td>
    </tr>
  </tbody>
</table>

### type

Valid values of type

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>primary</td>
      <td>Green</td>
    </tr>
    <tr>
      <td>default</td>
      <td>White</td>
    </tr>
    <tr>
      <td>warn</td>
      <td>Red</td>
    </tr>
  </tbody>
</table>

### formType

Valid values of form-type

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>submit</td>
      <td>Submits the form</td>
    </tr>
    <tr>
      <td>reset</td>
      <td>Resets the form</td>
    </tr>
  </tbody>
</table>

### openType

Valid values of open-type

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>contact</td>
      <td>Opens a customer service chat. If the user taps the message card in the chat to return to a Mini Program, the specific information can be obtained from the bindcontact callback. See <a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/customer-message/customer-message.html">details</a>.</td>
    </tr>
    <tr>
      <td>contactShare</td>
      <td></td>
    </tr>
    <tr>
      <td>share</td>
      <td>Triggers forwarding. Before use, read <a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/share.html#User-Guide">User Guide</a>.</td>
    </tr>
    <tr>
      <td>getRealnameAuthInfo</td>
      <td></td>
    </tr>
    <tr>
      <td>getAuthorize</td>
      <td></td>
    </tr>
    <tr>
      <td>getPhoneNumber</td>
      <td>	Gets the user's mobile number. The user information can be obtained from the bindgetphonenumber callback.<br />Vue3 example: <code>&lt;button @getphonenumber="callback" /&gt;</code><br />See <a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/getPhoneNumber.html">details</a></td>
    </tr>
    <tr>
      <td>getUserInfo</td>
      <td>Gets user information. The user information can be obtained from the bindgetuserinfo callback.</td>
    </tr>
    <tr>
      <td>lifestyle</td>
      <td></td>
    </tr>
    <tr>
      <td>launchApp</td>
      <td>Opens the app. The parameters passed to the app can be set via the app-parameter property. See <a href="https://developers.weixin.qq.com/miniprogram/en/dev/framework/open-ability/launchApp.html">details</a></td>
    </tr>
    <tr>
      <td>openSetting</td>
      <td>Opens the authorization setting page.</td>
    </tr>
    <tr>
      <td>feedback</td>
      <td>Opens the Feedback page, where users can submit feedback and upload logs. Developers can log in to the Mini Program admin console and open the Customer Service Feedback page from the left-side menu to get the feedback.</td>
    </tr>
  </tbody>
</table>

### lang

Valid values of lang

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>en</td>
      <td>English</td>
    </tr>
    <tr>
      <td>zh_CN</td>
      <td>Simplified Chinese</td>
    </tr>
    <tr>
      <td>zh_TW</td>
      <td>Traditional Chinese</td>
    </tr>
  </tbody>
</table>

### gender

Valid values of gender

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>Unknown</td>
    </tr>
    <tr>
      <td>1</td>
      <td>Male</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Female</td>
    </tr>
  </tbody>
</table>

### onGetUserInfoEventDetail

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
      <td>userInfo</td>
      <td><code>{`{ nickName: string; avatarUrl: string; gender: 0 | 1 | 2; province: string; city: string; country: string; }`}</code></td>
      <td></td>
    </tr>
    <tr>
      <td>rawData</td>
      <td><code>string</code></td>
      <td>Raw data <code>JSON</code> strings that do not include sensitive information and are used to calculate the signature.</td>
    </tr>
    <tr>
      <td>signature</td>
      <td><code>string</code></td>
      <td>Use <code>sha1(rawData + sessionkey)</code> to get the string for verifying user information</td>
    </tr>
    <tr>
      <td>encryptedData</td>
      <td><code>string</code></td>
      <td>Encrypted data with complete user information, including sensitive data.</td>
    </tr>
    <tr>
      <td>iv</td>
      <td><code>string</code></td>
      <td>The initial vector of the encryption algorithm</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td></td>
    </tr>
  </tbody>
</table>

### onContactEventDetail

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
      <td>errMsg</td>
      <td><code>string</code></td>
      <td></td>
    </tr>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td>The path specified by the mini-program's message.</td>
    </tr>
    <tr>
      <td>query</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>The query parameters specified by the mini-program's message.</td>
    </tr>
  </tbody>
</table>

### onGetPhoneNumberEventDetail

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
      <td>errMsg</td>
      <td><code>string</code></td>
      <td></td>
    </tr>
    <tr>
      <td>encryptedData</td>
      <td><code>string</code></td>
      <td>Encrypted data with complete user information including sensitive data.</td>
    </tr>
    <tr>
      <td>iv</td>
      <td><code>string</code></td>
      <td>The initial vector of the encryption algorithm.</td>
    </tr>
  </tbody>
</table>

### onOpenSettingEventDetail

<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
    </tr>
    <tr>
      <td>authSetting</td>
      <td><code>Record&lt;string, boolean&gt;</code></td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Button | ✔️ | ✔️ | ✔️ |
