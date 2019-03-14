---
category: Components
type: Feedback
title: Modal
subtitle: 对话框
---

用作显示系统的重要信息，并请求用户进行操作反馈，eg：删除某个重要内容时，弹出 Modal 进行二次确认。

### 规则
- 尽可能少用。Modal 会打断用户操作，只用在重要的时候。
- 标题应该简明，不能超过 1 行；描述内容应该简明、完整，一般不多于 2 行。
- 操作按钮最多到 3 个（竖排），一般为 1-2 个（横排）；3 个以上建议使用组件 ActionSheet 来完成。
- 一般将用户最可能点击的按钮，放在右侧。另外，取消按钮应当始终放在左侧。

## API

### Modal

属性 | 说明 | 类型 | 默认值
----|-----|------|------
| visible | 对话框是否可见 | Boolean | false |
| closable | 是否显示关闭按钮 | Boolean | false |
| maskClosable | 点击蒙层是否允许关闭 | Boolean | true |
| onClose | 点击 x 或 mask 回调 | (): void | 无 |
| transparent | 是否背景透明 | Boolean | false |
| popup | 是否弹窗模式 | Boolean | false |
| animationType | 可选: 'fade' / 'slide' | String | fade |
| title | 标题 | React.Element | 无 |
| footer | 底部内容 | Array [{text, onPress}] | [] |

### Modal.alert(title, message, actions?, platform?)

属性 | 说明 | 类型 | 默认值
----|-----|------|------
| title | 标题  | String 或 React.Element | 无  |
| message  | 提示信息  | String 或 React.Element  | 无  |
| actions | 按钮组, [{text, onPress, style}] | Array | 无  |

`Modal.alert(title, message, actions?, platform?).close()` 可以在外部关闭 Alert

### Modal.prompt(title, message, callbackOrActions, type?, defaultValue?, placeholders?, platform?)

属性 | 说明 | 类型 | 默认值
----|-----|------|------
| title | 标题  | String 或 React.Element | 无  |
| message  | 提示信息  | String 或 React.Element  | 无  |
| callbackOrActions  | 按钮组 [{text, onPress}] 或回调函数  | Array or Function | 无  |
| type | prompt 的样式 | String (`default`, `secure-text`, `login-password`)|  `default`  |
| defaultValue | 默认值(input 为 password 类型不支持) | String | -  |
| placeholders | ['', '']  | String[] | -  |


`Modal.prompt(title, message, callbackOrActions, type?, defaultValue?, placeholders?, platform?).close()` 可以在外部关闭 prompt`

### Modal.operation(actions?, platform?)

属性 | 说明 | 类型 | 默认值
----|-----|------|------
| actions | 按钮组, [{text, onPress, style}] | Array | 无  |

`Modal.operation(actions?, platform?).close()` 可以在外部关闭 operation`
