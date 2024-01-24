import '@tarojs/components/dist/taro-components/taro-components.css'
import '@tarojs/taro-h5/dist/index.css'
import '@tarojs/components-react/dist/index.css'

import { handlePolyfill } from '@tarojs/runtime'

if (process.env.SUPPORT_TARO_POLYFILL !== 'disabled') {
  handlePolyfill()
}
