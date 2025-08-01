<template>
  <view class="index">
    <text>{{ msg }}</text>
    <input placeholder="请输入" readonly />
  </view>
</template>

<script>
import { ref } from 'vue'
import './index.scss'

export default {
  setup () {
    const msg = ref('Hello world')
    return {
      msg
    }
  }
}
</script>
