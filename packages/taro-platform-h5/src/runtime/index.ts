import '@tarojs/components/dist/taro-components/taro-components.css'

import { handlePolyfill } from '@tarojs/runtime'

if (process.env.SUPPORT_TARO_POLYFILL !== 'disabled') {
  handlePolyfill()
}
