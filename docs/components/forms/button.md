---
title: Button
sidebar_label: Button
---

按钮

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/button.html)

## 类型

```tsx
ComponentType<ButtonProps>
```

## 示例代码

```tsx
export default class PageButton extends Component {
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
        <Button className='btn-max-w' plain type='primary'>按钮</Button>
        <Button className='btn-max-w' plain type='primary' disabled>不可点击的按钮</Button>
        <Button className='btn-max-w' plain >按钮</Button>
        <Button className='btn-max-w' plain disabled >按钮</Button>
        <Button size='mini' type='primary'>按钮</Button>
        <Button size='mini' >按钮</Button>
        <Button size='mini' type='warn'>按钮</Button>
      </View>
    )
  }
}
```

## ButtonProps

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
      <td>size</td>
      <td><code>&quot;default&quot; | &quot;mini&quot;</code></td>
      <td style="text-align:center"><code>default</code></td>
      <td style="text-align:center">否</td>
      <td>按钮的大小</td>
    </tr>
    <tr>
      <td>type</td>
      <td><code>&quot;default&quot; | &quot;primary&quot; | &quot;warn&quot;</code></td>
      <td style="text-align:center"><code>default</code></td>
      <td style="text-align:center">否</td>
      <td>按钮的样式类型</td>
    </tr>
    <tr>
      <td>plain</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>按钮是否镂空，背景色透明</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否禁用</td>
    </tr>
    <tr>
      <td>loading</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>名称前是否带 loading 图标</td>
    </tr>
    <tr>
      <td>formType</td>
      <td><code>&quot;submit&quot; | &quot;reset&quot;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>用于 <code>&lt;form/&gt;</code> 组件，点击分别会触发 <code>&lt;form/&gt;</code> 组件的 submit/reset 事件</td>
    </tr>
    <tr>
      <td>openType</td>
      <td><code>&quot;contact&quot; | &quot;contactShare&quot; | &quot;share&quot; | &quot;getRealnameAuthInfo&quot; | &quot;getAuthorize&quot; | &quot;getPhoneNumber&quot; | &quot;getUserInfo&quot; | &quot;lifestyle&quot; | &quot;launchApp&quot; | &quot;openSetting&quot; | &quot;feedback&quot;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>微信开放能力</td>
    </tr>
    <tr>
      <td>hoverClass</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>button-hover</code></td>
      <td style="text-align:center">否</td>
      <td>指定按下去的样式类。当 <code>hover-class=&quot;none&quot;</code> 时，没有点击态效果</td>
    </tr>
    <tr>
      <td>hoverStyle</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>none</code></td>
      <td style="text-align:center">否</td>
      <td>由于 RN 不支持 Class，故 RN 端的 Button 组件实现了 <code>hoverStyle</code>属性，写法和 style 类似，只不过 <code>hoverStyle</code> 的样式是指定按下去的样式。</td>
    </tr>
    <tr>
      <td>hoverStopPropagation</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>指定是否阻止本节点的祖先节点出现点击态</td>
    </tr>
    <tr>
      <td>hoverStartTime</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>20</code></td>
      <td style="text-align:center">否</td>
      <td>按住后多久出现点击态，单位毫秒</td>
    </tr>
    <tr>
      <td>hoverStayTime</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>70</code></td>
      <td style="text-align:center">否</td>
      <td>手指松开后点击态保留时间，单位毫秒</td>
    </tr>
    <tr>
      <td>lang</td>
      <td><code>&quot;en&quot; | &quot;zh_CN&quot; | &quot;zh_TW&quot;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。<br /><br />生效时机: <code>open-type=&quot;getUserInfo&quot;</code></td>
    </tr>
    <tr>
      <td>sessionFrom</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>会话来源<br /><br />生效时机：<code>open-type=&quot;contact&quot;</code></td>
    </tr>
    <tr>
      <td>sendMessageTitle</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>当前标题</code></td>
      <td style="text-align:center">否</td>
      <td>会话内消息卡片标题<br /><br />生效时机：<code>open-type=&quot;contact&quot;</code></td>
    </tr>
    <tr>
      <td>sendMessagePath</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>当前标题</code></td>
      <td style="text-align:center">否</td>
      <td>会话内消息卡片点击跳转小程序路径<br /><br />生效时机：<code>open-type=&quot;contact&quot;</code></td>
    </tr>
    <tr>
      <td>sendMessageImg</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>截图</code></td>
      <td style="text-align:center">否</td>
      <td>会话内消息卡片图片<br /><br />生效时机：<code>open-type=&quot;contact&quot;</code></td>
    </tr>
    <tr>
      <td>appParameter</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>打开 APP 时，向 APP 传递的参数<br /><br />生效时机：<code>open-type=&quot;launchApp&quot;</code></td>
    </tr>
    <tr>
      <td>scope</td>
      <td><code>&quot;userInfo&quot; | &quot;phoneNumber&quot;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>支付宝小程序 scope<br /><br />生效时机：<code>open-type=&quot;getAuthorize&quot;</code></td>
    </tr>
    <tr>
      <td>showMessageCard</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>显示会话内消息卡片<br /><br />生效时机：<code>open-type=&quot;contact&quot;</code></td>
    </tr>
    <tr>
      <td>onGetUserInfo</td>
      <td><code>BaseEventOrigFunction&lt;onGetUserInfoEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>用户点击该按钮时，会返回获取到的用户信息，回调的detail数据与 Taro.getUserInfo 返回的一致<br /><br />生效时机: <code>open-type=&quot;getUserInfo&quot;</code></td>
    </tr>
    <tr>
      <td>onGetAuthorize</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>支付宝获取会员基础信息授权回调<br /><br />生效时机：<code>open-type=&quot;getAuthorize&quot;</code></td>
    </tr>
    <tr>
      <td>onContact</td>
      <td><code>BaseEventOrigFunction&lt;onContactEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>客服消息回调<br /><br />生效时机：<code>open-type=&quot;contact&quot;</code></td>
    </tr>
    <tr>
      <td>onGetPhoneNumber</td>
      <td><code>BaseEventOrigFunction&lt;onGetPhoneNumberEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>获取用户手机号回调<br /><br />生效时机：<code>open-type=&quot;getphonenumber&quot;</code></td>
    </tr>
    <tr>
      <td>onGetRealnameAuthInfo</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>获取用户实名<br /><br />生效时机：<code>open-type=&quot;getRealnameAuthInfo&quot;</code></td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当使用开放能力时，发生错误的回调<br /><br />生效时机：<code>open-type=&quot;launchApp&quot;</code></td>
    </tr>
    <tr>
      <td>onOpenSetting</td>
      <td><code>BaseEventOrigFunction&lt;onOpenSettingEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>在打开授权设置页后回调<br /><br />生效时机：<code>open-type=&quot;openSetting&quot;</code></td>
    </tr>
    <tr>
      <td>onLaunchapp</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>打开 APP 成功的回调<br /><br />生效时机：<code>open-type=&quot;launchApp&quot;</code></td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: |
| ButtonProps.size | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.type | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.plain | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.disabled | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.loading | ✔️ |  | ✔️ | ✔️ |
| ButtonProps.formType | ✔️ |  |  |  |
| ButtonProps.openType | ✔️ |  |  |  |
| ButtonProps.hoverClass | ✔️ |  | ✔️ | (支持 hoverStyle 属性，但框架未支持 hoverClass) |
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

size 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>default</td>
      <td>默认大小</td>
    </tr>
    <tr>
      <td>mini</td>
      <td>小尺寸</td>
    </tr>
  </tbody>
</table>

### type

type 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>primary</td>
      <td>绿色</td>
    </tr>
    <tr>
      <td>default</td>
      <td>白色</td>
    </tr>
    <tr>
      <td>warn</td>
      <td>红色</td>
    </tr>
  </tbody>
</table>

### formType

form-type 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>submit</td>
      <td>提交表单</td>
    </tr>
    <tr>
      <td>reset</td>
      <td>重置表单</td>
    </tr>
  </tbody>
</table>

### openType

open-type 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>contact</td>
      <td>打开客服会话，如果用户在会话中点击消息卡片后返回小程序，可以从 bindcontact 回调中获得具体信息<br /><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/customer-message/customer-message.html">参考地址</a></td>
    </tr>
    <tr>
      <td>contactShare</td>
      <td></td>
    </tr>
    <tr>
      <td>share</td>
      <td>触发用户转发，使用前建议先阅读使用指引<br /><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html#%E4%BD%BF%E7%94%A8%E6%8C%87%E5%BC%95">参考地址</a></td>
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
      <td>获取用户手机号，可以从 bindgetphonenumber 回调中获取到用户信息<br /><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html">参考地址</a></td>
    </tr>
    <tr>
      <td>getUserInfo</td>
      <td>获取用户信息，可以从 bindgetuserinfo 回调中获取到用户信息</td>
    </tr>
    <tr>
      <td>lifestyle</td>
      <td></td>
    </tr>
    <tr>
      <td>launchApp</td>
      <td>打开APP，可以通过app-parameter属性设定向APP传的参数<br /><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/launchApp.html">参考地址</a></td>
    </tr>
    <tr>
      <td>openSetting</td>
      <td>打开授权设置页</td>
    </tr>
    <tr>
      <td>feedback</td>
      <td>打开“意见反馈”页面，用户可提交反馈内容并上传日志，开发者可以登录小程序管理后台后进入左侧菜单“客服反馈”页面获取到反馈内容</td>
    </tr>
  </tbody>
</table>

### lang

lang 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>en</td>
      <td>英文</td>
    </tr>
    <tr>
      <td>zh_CN</td>
      <td>简体中文</td>
    </tr>
    <tr>
      <td>zh_TW</td>
      <td>繁体中文</td>
    </tr>
  </tbody>
</table>

### onGetUserInfoEventDetail

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
      <td>userInfo</td>
      <td><code>{ nickName: string; avatarUrl: string; gender: 0 | 1 | 2; province: string; city: string; country: string; }</code></td>
      <td></td>
    </tr>
    <tr>
      <td>rawData</td>
      <td><code>string</code></td>
      <td>不包括敏感信息的原始数据 <code>JSON</code> 字符串，用于计算签名</td>
    </tr>
    <tr>
      <td>signature</td>
      <td><code>string</code></td>
      <td>使用 <code>sha1(rawData + sessionkey)</code> 得到字符串，用于校验用户信息</td>
    </tr>
    <tr>
      <td>encryptedData</td>
      <td><code>string</code></td>
      <td>包括敏感数据在内的完整用户信息的加密数据</td>
    </tr>
    <tr>
      <td>iv</td>
      <td><code>string</code></td>
      <td>加密算法的初始向量</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td></td>
    </tr>
  </tbody>
</table>

### gender

性别的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>未知</td>
    </tr>
    <tr>
      <td>1</td>
      <td>男</td>
    </tr>
    <tr>
      <td>2</td>
      <td>女</td>
    </tr>
  </tbody>
</table>

### onContactEventDetail

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
      <td>errMsg</td>
      <td><code>string</code></td>
      <td></td>
    </tr>
    <tr>
      <td>path</td>
      <td><code>string</code></td>
      <td>小程序消息指定的路径</td>
    </tr>
    <tr>
      <td>query</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>小程序消息指定的查询参数</td>
    </tr>
  </tbody>
</table>

### onGetPhoneNumberEventDetail

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
      <td>errMsg</td>
      <td><code>string</code></td>
      <td></td>
    </tr>
    <tr>
      <td>encryptedData</td>
      <td><code>string</code></td>
      <td>包括敏感数据在内的完整用户信息的加密数据</td>
    </tr>
    <tr>
      <td>iv</td>
      <td><code>string</code></td>
      <td>加密算法的初始向量</td>
    </tr>
  </tbody>
</table>

### onOpenSettingEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
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

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Button | ✔️ | ✔️ | ✔️ |
