
import './app.css'

import { useLaunch } from '@tarojs/taro'

function App({ children }) {
  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  return children
}



export default App
