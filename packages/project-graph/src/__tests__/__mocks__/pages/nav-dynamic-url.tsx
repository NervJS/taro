import { navigateTo } from '@tarojs/taro'

export default function DynamicUrlPage() {
  const id = '123'
  const go = () => {
    navigateTo({ url: `/pages/detail/index?id=${id}` })
  }
  return <view onClick={go}>dyn</view>
}
