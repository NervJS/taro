import { navigateTo } from '@tarojs/taro'

export default function Index() {
  const go = () => {
    navigateTo({ url: '/pages/detail/index' })
    navigateTo({ url: '/pages/ghost/index' })
  }
  return <view onClick={go}>index</view>
}
