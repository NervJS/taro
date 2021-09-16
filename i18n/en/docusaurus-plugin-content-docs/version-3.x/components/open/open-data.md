---
title: OpenData
sidebar_label: OpenData
---

Displays WeChat open data.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/open-data.html)

## Type

```tsx
ComponentType<OpenDataProps>
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
class App extends Component {
  render () {
    return (
      <OpenData type='userAvatarUrl'/>
    )
  }
}
```
</TabItem>

<TabItem value="Vue">

```html
<template>
  <open-data type="userAvatarUrl" />
</template>
```
  
</TabItem>
</Tabs>

## OpenDataProps

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
      <td>type</td>
      <td><code>&quot;groupName&quot; | &quot;userNickName&quot; | &quot;userAvatarUrl&quot; | &quot;userGender&quot; | &quot;userCity&quot; | &quot;userProvince&quot; | &quot;userCountry&quot; | &quot;userLanguage&quot;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The type of the open data.</td>
    </tr>
    <tr>
      <td>openGid</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The ID of the group. It is valid when type=&quot;groupName&quot;.</td>
    </tr>
    <tr>
      <td>lang</td>
      <td><code>&quot;en&quot; | &quot;zh_CN&quot; | &quot;zh_TW&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;en&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the language used to display userInfo. It is valid when type=&quot;user*&quot;.</td>
    </tr>
    <tr>
      <td>defaultText</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Default text when data is empty</td>
    </tr>
    <tr>
      <td>defaultAvatar</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Default image when user avatar is empty, supports relative paths and network image paths.</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when the group name or user information is empty.</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| OpenDataProps.type | ✔️ |  |  |
| OpenDataProps.openGid | ✔️ |  |  |
| OpenDataProps.lang | ✔️ |  |  |
| OpenDataProps.defaultText | ✔️ |  |  |
| OpenDataProps.defaultAvatar | ✔️ |  |  |
| OpenDataProps.onError | ✔️ |  |  |

### type

type Valid values of type

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>groupName</td>
      <td>The name of the group</td>
    </tr>
    <tr>
      <td>userNickName</td>
      <td>The nickname of the user</td>
    </tr>
    <tr>
      <td>userAvatarUrl</td>
      <td>The profile photo of the user</td>
    </tr>
    <tr>
      <td>userGender</td>
      <td>The gender of the user</td>
    </tr>
    <tr>
      <td>userCity</td>
      <td>The city where the user is located</td>
    </tr>
    <tr>
      <td>userProvince</td>
      <td>The province where the user is located</td>
    </tr>
    <tr>
      <td>userCountry</td>
      <td>The country where the user is located</td>
    </tr>
    <tr>
      <td>userLanguage</td>
      <td>The language used by the user</td>
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

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| OpenData | ✔️ |  |  |
