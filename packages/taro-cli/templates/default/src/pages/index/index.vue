<template>
  <view class="<%= pageName %>">
    <text>{{ msg }}</text>
  </view>
</template>

<script>
<%if (framework === 'vue3') {-%>
import { ref } from 'vue'
<%}-%>
import './index.<%= cssExt %>'

export default {
<%if (framework === 'vue') {-%>
  data () {
    return {
      msg: 'Hello world!'
    }
  }
<%}-%>
<%if (framework === 'vue3') {-%>
  setup () {
    const msg = ref('Hello world')
    return {
      msg
    }
  }
<%}-%>
}
</script>
