---
title: Taro.showActionSheet(OBJECT)
sidebar_label: showActionSheet
---


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
  .catch(err => console.log(err.errMsg))
```



## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.showActionSheet | ✔️ | ✔️ | ✔️ |

