---
title: 交互反馈
sidebar_label: 交互反馈
---

## Taro.showToast(OBJECT)

显示消息提示框，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| title | String | 是 | 提示的内容 |
| icon | String | 否 | 图标，有效值 "success", "loading", "none" |
| image | String | 否 | 自定义图标的本地路径，image 的优先级高于 icon |
| duration | Number | 否 | 提示的延迟时间，单位毫秒，默认：1500 |
| mask | Boolean | 否 | 是否显示透明蒙层，防止触摸穿透，默认：false |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**icon 有效值**

| 有效值 | 说明 |
| :-- | :-- |
| success | 显示成功图标 |
| loading | 显示加载图标 |
| none | 不显示图标 |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.showToast({
  title: '成功',
  icon: 'success',
  duration: 2000
})
  .then(res => console.log(res))
```

## Taro.showLoading(OBJECT)

显示 Loading 提示框, 需主动调用 Taro.hideLoading 才能关闭提示框，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| title | String | 是 | 提示的内容 |
| mask | Boolean | 否 | 是否显示透明蒙层，防止触摸穿透，默认：false |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

Taro.showLoading({
  title: 'loading'
})
  .then(res => console.log(res))
```

## Taro.hideToast()

隐藏消息提示框

## Taro.hideLoading()

隐藏 loading 提示框

## Taro.showModal(OBJECT)

​显示模态弹窗，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| title | String | 是 | 提示的标题 |
| content | String | 是 | 提示的内容 |
| showCancel | Boolean | 否 | 是否显示取消按钮，默认为 true |
| cancelText | String | 否 | 取消按钮的文字，默认为"取消"，最多 4 个字符 |
| cancelColor | HexColor | 否 | 取消按钮的文字颜色，默认为"#000000" |
| confirmText | String | 否 | 确定按钮的文字，默认为"确定"，最多 4 个字符 |
| confirmColor | HexColor | 否 | 确定按钮的文字颜色，默认为"#3CC51F" |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**success 返回参数说明：**

| 参数值 | 类型 | 说明 |
| :-- | :-- | :-- |
| confirm | Boolean | 为 true 时，表示用户点击了确定按钮 |
| cancel | Boolean | 为 true 时，表示用户点击了取消 |

**示例代码：**

```jsx
import Taro from '@tarojs/taro'

// 注意：无论用户点击确定还是取消，Promise 都会 resolve。
Taro.showModal({
  title: 'xxx',
  content: 'hello world',
})
  .then(res => console.log(res.confirm, res.cancel))
```

## Taro.showActionSheet(OBJECT)

显示操作菜单，支持 `Promise` 化使用。

​**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| itemList | String Array | 是 | 按钮的文字数组，数组长度最大为 6 个 |
| itemColor | HexColor | 否 | 按钮的文字颜色，默认为"#000000" |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**success 返回参数说明：**

| 参数值 | 类型 | 说明 |
| :-- | :-- | :-- |
| tapIndex | Number | 用户点击的按钮，从上到下的顺序，从 0 开始 |

```jsx
import Taro from '@tarojs/taro'

// 注意：当用户点击选项时 Promise 会 resolve，而当用户点击取消或蒙层时，Promise 会 reject。
Taro.showActionSheet({
  itemList: ['a', 'b', 'c']
})
  .then(res => console.log(res.errMsg, res.tapIndex))
  .catch(err => console.log(res.errMsg))
```

> API 支持度

| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.showToast | ✔️ | ✔️ | ✔️ |
| Taro.showLoading | ✔️ | ✔️ | ✔️ |
| Taro.hideToast | ✔️ | ✔️ | ✔️ |
| Taro.hideLoading | ✔️ | ✔️ | ✔️ |
| Taro.showModal | ✔️ | ✔️ | ✔️ |
| Taro.showActionSheet | ✔️ | ✔️ | ✔️ |
