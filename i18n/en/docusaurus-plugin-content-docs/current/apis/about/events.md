---
title: Event mechanism
---

Taro provides `Taro.Events` to implement the event mechanism, which needs to be instantiated for use, as follows:

```jsx
import Taro, { Events } from '@tarojs/taro'

const events = new Events()

// Listening for an event, accepting parameters
events.on('eventName', (arg) => {
  // doSth
})

// Listening to the same event and binding multiple handlers at the same time
events.on('eventName', handler1)
events.on('eventName', handler2)
events.on('eventName', handler3)

// Trigger an event, pass the reference
events.trigger('eventName', arg)

// Trigger an event, pass in multiple parameters
events.trigger('eventName', arg1, arg2, ...)

// Unlisten to an event
events.off('eventName')

// Cancel a handler that listens to an event
events.off('eventName', handler1)

// Unlisten to all events
events.off()
```
Taro also implements the global message centre (`Taro.eventCenter`), which is an instance of `Taro.Events`.

```jsx
import Taro from '@tarojs/taro'

Taro.eventCenter.on
Taro.eventCenter.trigger
Taro.eventCenter.off
```
