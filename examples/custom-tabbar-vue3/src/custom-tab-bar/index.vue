<template>
  <cover-view class="tab-bar">
    <cover-view class="tab-bar-border"></cover-view>
      <cover-view v-for="(item, index) in list" :key="index" class="tab-bar-item" @tap="switchTab(index, item.pagePath)">
        <cover-image :src="selected === index ? item.selectedIconPath : item.iconPath" />
        <cover-view :style="{ color: selected === index ? selectedColor : color }">{{item.text}}</cover-view>
      </cover-view>
  </cover-view>
</template>

<script setup>
import Taro from '@tarojs/taro'
import { computed }  from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const selected = computed(() => store.getters.getSelected)

const color = '#000000'
const selectedColor = '#DC143C'
const list = [
  {
    pagePath: '/pages/index/index',
    selectedIconPath: '../images/tabbar_home_on.png',
    iconPath: '../images/tabbar_home.png',
    text: '首页'
  },
  {
    pagePath: '/pages/cate/index',
    selectedIconPath: '../images/tabbar_cate_on.png',
    iconPath: '../images/tabbar_cate.png',
    text: '分类'
  },
  {
    pagePath: '/pages/cart/index',
    selectedIconPath: '../images/tabbar_cart_on.png',
    iconPath: '../images/tabbar_cart.png',
    text: '购物车'
  },
  {
    pagePath: '/pages/my/index',
    selectedIconPath: '../images/tabbar_my_on.png',
    iconPath: '../images/tabbar_my.png',
    text: '个人中心'
  }
]

function switchTab(index, url) {
  setSelected(index)
  Taro.switchTab({ url })
}

function setSelected (index) {
  store.dispatch('setSelected', index)
}
</script>

<style lang="scss">
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: white;
  display: flex;
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-bar-border {
  background-color: rgba(0, 0, 0, 0.33);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 1px;
  transform: scaleY(0.5);
}

.tab-bar-item {
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.tab-bar-item cover-image {
  width: 54px;
  height: 54px;
}

.tab-bar-item cover-view {
  font-size: 20px;
}
</style>
