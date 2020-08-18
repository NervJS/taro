---
title: Taro.showModal(OBJECT)
sidebar_label: showModal
---


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

## 示例代码

```jsx
import Taro from '@tarojs/taro'

// 注意：无论用户点击确定还是取消，Promise 都会 resolve。
Taro.showModal({
  title: 'xxx',
  content: 'hello world',
})
  .then(res => console.log(res.confirm, res.cancel))
```



## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| Taro.showModal | ✔️ | ✔️ | ✔️ |

