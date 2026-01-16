<template>
  <view>
    <view>Detail: </view>
    <button @tap="goto">Go To Detail</button>

    <view>Picker: </view>
    <my-picker title="test" :list="list" :on-button-click="onButtonClick"></my-picker>
  </view>
</template>

<script>
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import Picker from '../../taro/components/picker/index'

import './index.scss'
import '../../taro/css/components/picker/index.css'

export default {
  components: {
    MyPicker: Picker
  },
  setup () {
    const list = ref(['A', 'B', 'C'])

    function goto () {
      Taro.navigateTo({ url: '/pages/detail/index' })
    }

    function onButtonClick () {
      console.log('onButtonClick')
    }

    return {
      list,
      goto,
      onButtonClick
    }
  }
}
</script>
