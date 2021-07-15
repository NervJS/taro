---
title: Vue3
---

Taro can be developed with Vue 3, and developers can use the `taro init` command to create a **default** template for Vue3 or a **vuex** template for experience.

You can refer to the [Taro Vue documentation](./vue.md), this article will focus on the main differences between using Vue3 in Taro and using Vue.

New Vue3 features can be found in  [Vue3 documentation](https://v3.vuejs.org/guide/migration/introduction.html#notable-new-features)。

For more information on how Taro is compatible with Vue3, see [Taro RFC](https://github.com/NervJS/taro-rfcs/blob/master/rfcs/0001-vue-3-support.md)。

## Entry Components

Due to changes in the Vue3 Global API（[0009-global-api-change](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0009-global-api-change.md)）, The entry component of Vue3 will be written in the following way.

```js title="src/app.js"
import { createApp } from 'vue'

const app = createApp({
  onShow (options) {
    // ...
  }
  // The entry component does not need to implement the render method, and even if it does, it will be overridden by taro.
})

export app
```

## Page Components

The page component uses Vue SFC to export a Vue3 component normally.

Developers can choose to use options-style configuration or [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html), Browse the  [Vue 3 documentation](https://v3.vuejs.org/) to learn more about the Vue3 changes.

```html
<template>
  <view class="index">
    <text>{{ msg }}</text>
  </view>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const msg = ref('Hello world')
    return {
      msg
    }
  }
}
</script>
```

## 其它限制

* `<style scoped>` is not supported in the mini-program, it is recommended to use cssModules instead.[#6662](https://github.com/NervJS/taro/issues/6662)
* Elements cannot be inserted outside the DOM tree of a page component, so `<teleport>` is not supported
* The internal implementation of Vue 3 uses Proxy, which does not work on iOS 9 and below. However, the official Vue team will release a compatible version after the official release.
* Using ref on the H5 side to get the DOM node of the base component now only gets the Vue component instance of the adaptation layer, not the corresponding webComponent root node. This was possible in Vue2 by modifying the refs property of the parent element, but the order of initialization between components has changed in Vue3, so it is not supported for now.
* The v-model binding property of Vue3 has been changed to modelValue and the event binding has been changed to update:modelValue. For example, input automatically corresponds to modelValue and value, update:modelValue and @input, but for Picker, which is an applet-specific form, it does not, so we recommend not using v-model in this case.
* The VirtualList component needs to implement a Vue3 version (to be implemented)
* The `id` of all components must remain unique throughout the application (even if they are on different pages), otherwise it may cause problems with events not firing.[#7317](https://github.com/NervJS/taro/issues/7317)


## Related Reading

[Developing mini-program with Vue3](https://taro-club.jd.com/topic/2267/%E4%BD%BF%E7%94%A8-vue3-%E5%BC%80%E5%8F%91%E5%B0%8F%E7%A8%8B%E5%BA%8F) by lillian
