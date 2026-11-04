import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useCallback, useState } from 'react'
import './index.scss'

export default function Sub2Page() {
  const [status, setStatus] = useState('')
  const [OnlySub2Comp, setOnlySub2Comp] = useState(null)
  const [SharedComp, setSharedComp] = useState(null)

  // 仅 sub2 消费：chunk 归属 pages/sub2-async
  const loadOnlySub2 = useCallback(async () => {
    Taro.showLoading({ title: '动态加载中' })
    try {
      const module = await import('./OnlySub2')
      setOnlySub2Comp(() => module.default)
      setStatus('OnlySub2 加载完成（pages/sub2-async）')
    } catch (err) {
      setStatus(`OnlySub2 加载失败：${err.message}`)
    } finally {
      Taro.hideLoading()
    }
  }, [])

  // 与 sub1 共同消费：chunk 归属 pages/shared-async
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
    <View className="sub2-page">
      <View className="header">
        <Text className="title">Sub2 页面（async-only）</Text>
      </View>
      <View className="actions">
        <Button className="button" onClick={loadOnlySub2}>
          动态导入 OnlySub2
        </Button>
        <Button className="button" onClick={loadShared}>
          动态导入 SharedBySub1Sub2
        </Button>
      </View>
      {!!status && (
        <Text className="status">{status}</Text>
      )}
      {OnlySub2Comp && <OnlySub2Comp />}
      {SharedComp && <SharedComp />}
    </View>
  )
}
