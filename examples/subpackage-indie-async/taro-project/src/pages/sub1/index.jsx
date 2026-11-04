import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useCallback, useState } from 'react'
import './index.scss'

export default function Sub1Page() {
  const [status, setStatus] = useState('')
  const [OnlySub1Comp, setOnlySub1Comp] = useState(null)
  const [SharedComp, setSharedComp] = useState(null)

  // 仅 sub1 消费：chunk 归属 pages/sub1-async
  const loadOnlySub1 = useCallback(async () => {
    Taro.showLoading({ title: '动态加载中' })
    try {
      const module = await import('./OnlySub1')
      setOnlySub1Comp(() => module.default)
      setStatus('OnlySub1 加载完成（pages/sub1-async）')
    } catch (err) {
      setStatus(`OnlySub1 加载失败：${err.message}`)
    } finally {
      Taro.hideLoading()
    }
  }, [])

  // sub1 和 sub2 共同消费：chunk 归属 pages/shared-async
  const loadShared = useCallback(async () => {
    Taro.showLoading({ title: '动态加载中' })
    try {
      const module = await import('../../components/SharedBySub1Sub2')
      setSharedComp(() => module.default)
      setStatus('SharedBySub1Sub2 加载完成（pages/shared-async）')
    } catch (err) {
      setStatus(`SharedBySub1Sub2 加载失败：${err.message}`)
    } finally {
      Taro.hideLoading()
    }
  }, [])

  return (
    <View className="sub1-page">
      <View className="header">
        <Text className="title">Sub1 页面（async-only）</Text>
      </View>
      <View className="actions">
        <Button className="button" onClick={loadOnlySub1}>
          动态导入 OnlySub1
        </Button>
        <Button className="button" onClick={loadShared}>
          动态导入 SharedBySub1Sub2
        </Button>
      </View>
      {!!status && (
        <Text className="status">{status}</Text>
      )}
      {OnlySub1Comp && <OnlySub1Comp />}
      {SharedComp && <SharedComp />}
    </View>
  )
}
