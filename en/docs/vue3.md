---
title: Vue3
---

Taro can be developed using Vue 3. Developers can use the `taro init` command to create templates for Vue 3, including **default**, **vuex**, and [NutUI3.0](https://nutui.jd.com/#/button).We recommend using NutUI3.0 templates for development.

For details, please refer to the Taro Vue series documentation.

Developers can choose to organize their logic using options-style configuration or the [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html) and browse the \[Vue 3 documentation\](https://v3. vuejs.org/) to learn more about Vue3 changes.

## Other limitations

* `<style scoped>` is not supported in the mini-program, it is recommended to use cssModules instead.[#6662](https://github.com/NervJS/taro/issues/6662)[#6662](https://github.com/NervJS/taro/issues/6662)
* Elements cannot be inserted outside the DOM tree of a page component, so `<teleport>` is not supported
* The internal implementation of Vue 3 uses Proxy, which does not work on iOS 9 and below.However, the official Vue team will release a compatible version after the official release.
* Using ref on the H5 side to get the DOM node of the base component now only gets the Vue component instance of the adaptation layer, not the corresponding webComponent root node.This was possible in Vue2 by modifying the refs property of the parent element, but the order of initialization between components has changed in Vue3, so it is not supported for now.
* 小程序端非类似 HTML 表单标签规范的表单组件，如 Picker，暂不兼容 v-model。The v-model binding property of Vue3 has been changed to modelValue and the event binding has been changed to update:modelValue.对于 HTML 表单标签会自动对接表单的值与事件，例如 input 会自动对应 modelValue 与 value、update:modelValue 与 @input。For example, input automatically corresponds to modelValue and value, update:modelValue and @input, but for Picker, which is an mini program-specific form, it does not, so we recommend not using v-model in this case.
* The VirtualList component needs to implement a Vue3 version (to be implemented)
* The `id` of all components must remain unique throughout the application (even if they are on different pages), otherwise it may cause problems with events not firing.[#7317](https://github.com/NervJS/taro/issues/7317)


## Related Reading

New Vue3 features can be found in the [Vue3 documentation](https://v3.vuejs.org/guide/migration/introduction.html#notable-new-features).

How Taro is compatible with Vue3 can be found in [Taro RFC](https://github.com/NervJS/taro-rfcs/blob/master/rfcs/0001-vue-3-support.md).

[Developing Applets with Vue3](https://taro-club.jd.com/topic/2267/%E4%BD%BF%E7%94%A8-vue3-%E5%BC%80%E5%8F%91%E5%B0%8F%E7%A8%8B%E5%BA%8F) by lillian.

[ NutUI Development Example ](https://github.com/jdf2e/nutui-demo/tree/master/taro) by jdf2e.
