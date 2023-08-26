import { PropsWithChildren } from 'react'
import Taro, { useDidHide, useDidShow, useError, useLaunch, usePageNotFound } from '@tarojs/taro'
import { TestConsole } from '@/util/util'
import './app.scss'

function App({ children }: PropsWithChildren) {
  useLaunch(() => {
    TestConsole.consoleNormal('useLaunch')
  })

  useDidShow((res) => {
    TestConsole.consoleNormal('useDidShow', res)
  })

  useDidHide(() => {
    TestConsole.consoleNormal('useDiduseDidHideShow')
  })

  useError((error) => {
    TestConsole.consoleNormal('useError', error)
    Taro.showToast({
      title: 'Error',
      icon: 'error',
    })
  })

  usePageNotFound((res) => {
    TestConsole.consoleNormal('usePageNotFound', res)
    try {
      Taro.showToast({
        title: 'PageNotFound',
        icon: 'error',
      })
    } catch (err) {}
  })

  // children 是将要会渲染的页面
  return children
}

export default App
