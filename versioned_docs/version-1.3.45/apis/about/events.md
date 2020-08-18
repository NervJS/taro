---
title: 消息机制
---

Taro 提供了 `Taro.Events` 来实现消息机制，使用时需要实例化它，如下

```jsx
import Taro, { Events } from '@tarojs/taro'

const events = new Events()

// 监听一个事件，接受参数
events.on('eventName', (arg) => {
  // doSth
})

// 监听同个事件，同时绑定多个 handler
events.on('eventName', handler1)
events.on('eventName', handler2)
events.on('eventName', handler3)

// 触发一个事件，传参
events.trigger('eventName', arg)

// 触发事件，传入多个参数
events.trigger('eventName', arg1, arg2, ...)

// 取消监听一个事件
events.off('eventName')

// 取消监听一个事件某个 handler
events.off('eventName', handler1)

// 取消监听所有事件
events.off()
```

同时 Taro 还提供了一个全局消息中心 `Taro.eventCenter` 以供使用，它是 `Taro.Events` 的实例

```jsx
import Taro from '@tarojs/taro'

Taro.eventCenter.on
Taro.eventCenter.trigger
Taro.eventCenter.off
```
