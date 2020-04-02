---
title: OpenData
sidebar_label: OpenData
id: version-1.3.38-open-data
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

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| type | "groupName" or "userNickName" or "userAvatarUrl" or "userGender" or "userCity" or "userProvince" or "userCountry" or "userLanguage" |  | 是 | 开放数据类型 |
| openGid | `string` |  | 否 | 当 type="groupName" 时生效, 群id |
| lang | "en" or "zh_CN" or "zh_TW" | `"en"` | 否 | 当 type="user*" 时生效，以哪种语言展示 userInfo |
| defaultText | `string` |  | 否 | 数据为空时的默认文案 |
| defaultAvatar | `string` |  | 否 | 用户头像为空时的默认图片，支持相对路径和网络图片路径 |
| onError | `BaseEventOrigFunction<any>` |  | 否 | 群名称或用户信息为空时触发 |

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

| 参数 | 说明 |
| --- | --- |
| groupName | 拉取群名称 |
| userNickName | 用户昵称 |
| userAvatarUrl | 用户头像 |
| userGender | 用户性别 |
| userCity | 用户所在城市 |
| userProvince | 用户所在省份 |
| userCountry | 用户所在国家 |
| userLanguage | 用户的语言 |

### lang

lang 的合法值

| 参数 | 说明 |
| --- | --- |
| en | 英文 |
| zh_CN | 简体中文 |
| zh_TW | 繁体中文 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| OpenData | ✔️ |  |  |
