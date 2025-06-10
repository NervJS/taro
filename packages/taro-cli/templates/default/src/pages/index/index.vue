<template>
  <view class="{{ pageName }}">
    <text>\{{ msg }}</text>
  </view>
</template>

<script>
{{#if (eq framework 'Vue3') }}
import { ref } from 'vue'
{{/if}}
import './index.{{ cssExt }}'

export default {
{{#if (eq framework 'Vue3') }}
  setup () {
    const msg = ref('Hello world')
    return {
      msg
    }
  }
{{/if}}
}
</script>
