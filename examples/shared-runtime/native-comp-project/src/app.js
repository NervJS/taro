import { Component } from 'react'
import './app.scss'

// native-components 模式无页面路由,App 仅承接生命周期。
// 共享运行时下 createReactApp 首个调用会被同步核占位(app-shim.js),真身激活后 flush;
// 多包共存时按 pkgId 存入 shared.__pkgApps。native-comp 场景另建 __nativeComponentApps 表
// (@tarojs/react connect-native.ts 的 isNativeShared 分支),与 __pkgApps 平行不互覆。
class App extends Component {
  componentDidMount () {
    console.log('[native-comp app] launch')
  }

  render () {
    // native-components 无路由,不消费 this.props.children——保留返回是 Taro App 惯例形态。
    return this.props.children
  }
}

export default App
