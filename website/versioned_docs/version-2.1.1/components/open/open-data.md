---
title: OpenData
sidebar_label: OpenData
id: version-2.1.1-open-data
original_id: open-data
---

用于展示微信开放的数据

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/open-data.html)

## 类型

```tsx
ComponentType<OpenDataProps>
```

## 示例代码

```tsx
class App extends Component {
  render () {
    return (
      <OpenData type='userAvatarUrl'/>
    )
  }
}
```

## OpenDataProps

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
      <td>type</td>
      <td><code>&quot;groupName&quot; | &quot;userNickName&quot; | &quot;userAvatarUrl&quot; | &quot;userGender&quot; | &quot;userCity&quot; | &quot;userProvince&quot; | &quot;userCountry&quot; | &quot;userLanguage&quot;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>开放数据类型</td>
    </tr>
    <tr>
      <td>openGid</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当 type=&quot;groupName&quot; 时生效, 群id</td>
    </tr>
    <tr>
      <td>lang</td>
      <td><code>&quot;en&quot; | &quot;zh_CN&quot; | &quot;zh_TW&quot;</code></td>
      <td style="text-align:center"><code>&quot;en&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>当 type=&quot;user*&quot; 时生效，以哪种语言展示 userInfo</td>
    </tr>
    <tr>
      <td>defaultText</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>数据为空时的默认文案</td>
    </tr>
    <tr>
      <td>defaultAvatar</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>用户头像为空时的默认图片，支持相对路径和网络图片路径</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>群名称或用户信息为空时触发</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| OpenDataProps.type | ✔️ |  |  |
| OpenDataProps.openGid | ✔️ |  |  |
| OpenDataProps.lang | ✔️ |  |  |
| OpenDataProps.defaultText | ✔️ |  |  |
| OpenDataProps.defaultAvatar | ✔️ |  |  |
| OpenDataProps.onError | ✔️ |  |  |

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
      <td>groupName</td>
      <td>拉取群名称</td>
    </tr>
    <tr>
      <td>userNickName</td>
      <td>用户昵称</td>
    </tr>
    <tr>
      <td>userAvatarUrl</td>
      <td>用户头像</td>
    </tr>
    <tr>
      <td>userGender</td>
      <td>用户性别</td>
    </tr>
    <tr>
      <td>userCity</td>
      <td>用户所在城市</td>
    </tr>
    <tr>
      <td>userProvince</td>
      <td>用户所在省份</td>
    </tr>
    <tr>
      <td>userCountry</td>
      <td>用户所在国家</td>
    </tr>
    <tr>
      <td>userLanguage</td>
      <td>用户的语言</td>
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

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| OpenData | ✔️ |  |  |
