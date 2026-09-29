import Taro, { navigateTo, redirectTo as rd } from '@tarojs/taro'

export default function NavPage() {
  const go = () => {
    navigateTo({ url: '/pages/a/index' })
    rd({ url: '/pages/b/index' })
    Taro.switchTab({ url: '/pages/c/index' })
  }
  return <view onClick={go}>nav</view>
}
