import { Navigator, Button } from '@tarojs/components'

export default function () {
  return (
    <Navigator url='/pages/sub/sub-one/index'>
      <Button>跳转到独立分包页</Button>
    </Navigator>
  )
}
