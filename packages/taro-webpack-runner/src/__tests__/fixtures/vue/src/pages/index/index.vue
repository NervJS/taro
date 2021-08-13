<template>
  <view class="index">
    <text>{{ msg }}</text>
  </view>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Hello world!'
    }
  }
}
</script>

<style lang='scss'>
.index {
  color: blue;
}
</style>

<style lang='sass'>
.detail
  color: red
</style>
